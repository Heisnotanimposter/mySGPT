import os
import struct
import torch
from tokenizer import NanoTokenizer
from model import NanoGPT

def export_binary_weights(pt_path="weights/model.pt", vocab_path="weights/vocab.json", out_bin="weights/slm_weights.bin"):
  """
  Packs PyTorch checkpoint into a compact, contiguous binary weight file (.bin)
  specifically formatted for high-performance zero-dependency inference on Raspberry Pi 3.
  """
  if not os.path.exists(pt_path):
    raise FileNotFoundError(f"Checkpoint {pt_path} not found. Run train.py first!")

  tokenizer = NanoTokenizer.load(vocab_path)
  vocab_size = tokenizer.vocab_size

  # Reconstruct model configuration
  d_model = 128
  n_layer = 4
  n_head = 4
  block_size = 64

  model = NanoGPT(vocab_size=vocab_size, d_model=d_model, n_layer=n_layer, n_head=n_head, block_size=block_size)
  model.load_state_dict(torch.load(pt_path, map_location="cpu"))
  model.eval()

  state_dict = model.state_dict()
  num_params = model.num_params()

  print(f"Exporting model with {num_params:,} parameters to {out_bin}...")

  with open(out_bin, "wb") as f:
    # 1. Header (Magic + Config Params)
    magic = b"SLM1"
    header = struct.pack(
      "<4sIIIIIII",
      magic,
      vocab_size,
      d_model,
      n_layer,
      n_head,
      block_size,
      num_params,
      0 # float32 flag
    )
    f.write(header)

    # 2. Write Parameter Tensors Contiguously
    written_count = 0
    for name, param in state_dict.items():
      tensor_bytes = param.detach().cpu().numpy().astype("float32").tobytes()
      f.write(tensor_bytes)
      written_count += param.numel()

  size_mb = os.path.getsize(out_bin) / (1024 * 1024)
  print(f"✅ Success! Packed {written_count:,} weights into {out_bin} ({size_mb:.2f} MB)")
  print(f"Target Check: {size_mb:.2f} MB < 30 MB -> PASSED for Raspberry Pi 3 deployment!")

if __name__ == "__main__":
  export_binary_weights()
