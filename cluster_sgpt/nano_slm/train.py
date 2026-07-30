import os
import time
import torch
from tokenizer import NanoTokenizer
from model import NanoGPT

def train():
  # Sample pretraining dataset corpus (Economic & AI Labor Market Domain)
  sample_text = """
  Employment Pulse AI and Small Language Models (SLMs) enable real-time economic vector clustering.
  Small Language Models run efficiently on edge devices like Raspberry Pi 3 with minimal RAM.
  K-Means clustering and Principal Component Analysis (PCA) partition OECD macroeconomic data into structural archetypes.
  The CLAG Framework introduces agentic routing to assign memory notes using intent pseudo-labels.
  Geometric analysis of SLM hallucinations demonstrates that genuine responses form dense clusters in embedding space.
  PRISM teacher-student distillation optimizes local geometry for tight cluster separability and low inference latency.
  Monetary policy interest rates, Fed benchmark rates, and AI automation velocity shape workforce dynamics across tech sectors.
  """ * 100 # Repeat to form training corpus

  print("Initializing NanoTokenizer...")
  tokenizer = NanoTokenizer()
  data = torch.tensor(tokenizer.encode(sample_text), dtype=torch.long)
  vocab_size = tokenizer.vocab_size

  print(f"Corpus Token Count: {len(data)} | Vocab Size: {vocab_size}")

  # Model Hyperparameters for Raspberry Pi 3 target (<30MB)
  d_model = 128
  n_layer = 4
  n_head = 4
  block_size = 64
  batch_size = 16

  model = NanoGPT(vocab_size=vocab_size, d_model=d_model, n_layer=n_layer, n_head=n_head, block_size=block_size)
  param_count = model.num_params()
  weight_size_mb = (param_count * 4) / (1024 * 1024)

  print(f"Model Parameters: {param_count:,} (~{weight_size_mb:.2f} MB float32)")
  assert weight_size_mb < 30.0, "Model weight size must be under 30MB!"

  optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)

  print("Starting Pretraining Loop (500 steps)...")
  model.train()
  t0 = time.time()

  for step in range(501):
    # Random batch sample
    ix = torch.randint(len(data) - block_size - 1, (batch_size,))
    x = torch.stack([data[i:i+block_size] for i in ix])
    y = torch.stack([data[i+1:i+block_size+1] for i in ix])

    logits, loss = model(x, y)
    optimizer.zero_grad(set_to_none=True)
    loss.backward()
    optimizer.step()

    if step % 100 == 0:
      print(f"Step {step:4d} | Loss: {loss.item():.4f} | Elapsed: {time.time() - t0:.2f}s")

  # Save PyTorch Checkpoint & Vocab
  os.makedirs("weights", exist_ok=True)
  torch.save(model.state_dict(), "weights/model.pt")
  tokenizer.save("weights/vocab.json")
  print("Pretrained checkpoint saved to weights/model.pt and weights/vocab.json")

if __name__ == "__main__":
  train()
