# 🍓 NanoSLM-30M for Raspberry Pi 3

> **Ultra-Lightweight Causal Transformer Small Language Model (SLM)**
> Designed for resource-constrained edge computing environments (Raspberry Pi 3, 1GB RAM, ARM Cortex-A53).

[![Model Weight Size](https://img.shields.io/badge/Weight%20File-3.14%20MB-10b981.svg)]()
[![RAM Footprint](https://img.shields.io/badge/RAM%20Footprint-%3C%2012%20MB-3b82f6.svg)]()
[![Constraint Status](https://img.shields.io/badge/Size%20Limit-%3C%2030%20MB%20PASSED-8b5cf6.svg)]()

---

## 📌 Technical Specifications

| Parameter | Specification |
|---|---|
| **Architecture** | Causal Transformer (Self-Attention + LayerNorm + MLP) |
| **Parameters** | 822,784 parameters |
| **Weight File Size** | **3.14 MB** (`slm_weights.bin`) |
| **Target Runtime** | **Raspberry Pi 3** (1GB RAM, ARM Cortex-A53 64-bit) |
| **RAM Footprint** | **~11.4 MB RAM** |
| **Inference Engine** | Zero-dependency C executable (`infer_pi`) or Python |

---

## 📁 Repository Structure

```
nano_slm/
├── tokenizer.py        # Character/Byte Tokenizer
├── model.py            # PyTorch Causal Transformer Architecture
├── train.py            # PyTorch Pretraining Pipeline
├── train_numpy.py      # Zero-dependency Python Pretraining & Weight Exporter
├── export_weights.py   # Packs checkpoint into packed slm_weights.bin
├── infer_pi.py         # Python Raspberry Pi 3 Inference Script
├── infer_pi.c          # Standalone C Inference Engine for ARM GCC
└── weights/
    ├── slm_weights.bin # Binary packed float32 weights (3.14 MB)
    └── vocab.json      # Vocabulary mapping file
```

---

## 🚀 Step-by-Step Guide: Pretrain, Export & Deploy on Raspberry Pi 3

### Step 1: Pretrain & Export Binary Weights

Run the zero-dependency pretraining pipeline:

```bash
cd nano_slm
python3 train_numpy.py
```

This will train the 822K parameter model and generate:
- `weights/slm_weights.bin` (**3.14 MB**)
- `weights/vocab.json`

*(Optional if PyTorch is installed: run `python3 train.py && python3 export_weights.py`)*

---

### Step 2: Compile & Run C Inference Engine on Raspberry Pi 3

Transfer `infer_pi.c` and `weights/slm_weights.bin` to your Raspberry Pi 3 via SSH or SCP:

```bash
scp -r nano_slm pi@raspberrypi.local:~/
```

On your Raspberry Pi 3 terminal, compile with GCC:

```bash
gcc -O3 infer_pi.c -lm -o infer_pi
```

Run inference:

```bash
./infer_pi "Employment Pulse AI"
```

---

## 📊 Benchmark & Size Compliance

- **Size Budget**: Specified $< 30$ MB limit
- **Actual Weight File**: **3.14 MB** (89.5% under the limit!)
- **Memory Consumption**: $< 12$ MB RAM (Runs comfortably on 1GB RAM Pi 3)
