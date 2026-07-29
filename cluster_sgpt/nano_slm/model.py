import math
import struct
import torch
import torch.nn as nn
import torch.nn.functional as F

class CausalSelfAttention(nn.Module):
  def __init__(self, d_model=128, n_head=4, block_size=128):
    super().__init__()
    assert d_model % n_head == 0
    self.n_head = n_head
    self.d_head = d_model // n_head
    self.c_attn = nn.Linear(d_model, 3 * d_model)
    self.c_proj = nn.Linear(d_model, d_model)
    
    # Causal mask buffer
    self.register_buffer("bias", torch.tril(torch.ones(block_size, block_size)).view(1, 1, block_size, block_size))

  def forward(self, x):
    B, T, C = x.size()
    q, k, v = self.c_attn(x).split(C, dim=2)

    # (B, n_head, T, d_head)
    q = q.view(B, T, self.n_head, self.d_head).transpose(1, 2)
    k = k.view(B, T, self.n_head, self.d_head).transpose(1, 2)
    v = v.view(B, T, self.n_head, self.d_head).transpose(1, 2)

    att = (q @ k.transpose(-2, -1)) * (1.0 / math.sqrt(self.d_head))
    att = att.masked_fill(self.bias[:, :, :T, :T] == 0, float('-inf'))
    att = F.softmax(att, dim=-1)

    y = att @ v # (B, n_head, T, d_head)
    y = y.transpose(1, 2).contiguous().view(B, T, C)
    return self.c_proj(y)

class MLP(nn.Module):
  def __init__(self, d_model=128):
    super().__init__()
    self.c_fc = nn.Linear(d_model, 4 * d_model)
    self.act = nn.GELU()
    self.c_proj = nn.Linear(4 * d_model, d_model)

  def forward(self, x):
    return self.c_proj(self.act(self.c_fc(x)))

class Block(nn.Module):
  def __init__(self, d_model=128, n_head=4, block_size=128):
    super().__init__()
    self.ln_1 = nn.LayerNorm(d_model)
    self.attn = CausalSelfAttention(d_model, n_head, block_size)
    self.ln_2 = nn.LayerNorm(d_model)
    self.mlp = MLP(d_model)

  def forward(self, x):
    x = x + self.attn(self.ln_1(x))
    x = x + self.mlp(self.ln_2(x))
    return x

class NanoGPT(nn.Module):
  """
  Lightweight Causal Transformer model (~1.2M Parameters, ~4.8MB float32).
  Targeted for low-resource environments (Raspberry Pi 3, 1GB RAM).
  """
  def __init__(self, vocab_size=128, d_model=128, n_layer=4, n_head=4, block_size=128):
    super().__init__()
    self.vocab_size = vocab_size
    self.d_model = d_model
    self.n_layer = n_layer
    self.block_size = block_size

    self.transformer = nn.ModuleDict(dict(
      wte = nn.Embedding(vocab_size, d_model),
      wpe = nn.Embedding(block_size, d_model),
      h = nn.ModuleList([Block(d_model, n_head, block_size) for _ in range(n_layer)]),
      ln_f = nn.LayerNorm(d_model),
    ))
    self.lm_head = nn.Linear(d_model, vocab_size, bias=False)

  def forward(self, idx, targets=None):
    device = idx.device
    b, t = idx.size()
    assert t <= self.block_size, f"Cannot forward sequence of length {t}, block size is {self.block_size}"

    pos = torch.arange(0, t, dtype=torch.long, device=device).unsqueeze(0)
    tok_emb = self.transformer.wte(idx)
    pos_emb = self.transformer.wpe(pos)
    x = tok_emb + pos_emb

    for block in self.transformer.h:
      x = block(x)

    x = self.transformer.ln_f(x)
    logits = self.lm_head(x)

    loss = None
    if targets is not None:
      loss = F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1))

    return logits, loss

  @torch.no_grad()
  def generate(self, idx, max_new_tokens, temperature=1.0, top_k=None):
    for _ in range(max_new_tokens):
      idx_cond = idx[:, -self.block_size:]
      logits, _ = self(idx_cond)
      logits = logits[:, -1, :] / temperature
      if top_k is not None:
        v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
        logits[logits < v[:, [-1]]] = -float('Inf')
      probs = F.softmax(logits, dim=-1)
      idx_next = torch.multinomial(probs, num_samples=1)
      idx = torch.cat((idx, idx_next), dim=1)
    return idx

  def num_params(self):
    return sum(p.numel() for p in self.parameters())
