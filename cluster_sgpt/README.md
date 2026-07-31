# 🌐 cluster_sgpt

> **Next-Generation Global Economic Intelligence, Small GPT Labor Analyst, K-Means Vector Clustering, and Enterprise API Gateway.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-10b981.svg)]()
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)]()
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)]()
[![ML Clustering](https://img.shields.io/badge/ML-K--Means%20%2B%20PCA-8b5cf6.svg)]()
[![AI Inference](https://img.shields.io/badge/Small%20GPT-Offline%20Engine-f59e0b.svg)]()

---

## 🌟 Overview

**cluster_sgpt** transforms raw macroeconomic statistics into actionable intelligence. Combining real-time OECD data feeds, live recruitment signals, client-side **Small GPT transformer reasoning**, unsupervised **K-Means vector clustering with 2D PCA projection**, and a full developer **API Gateway**, it provides an end-to-end platform for economists, developers, and talent strategists.

---

## ✨ Key Features

### 🧠 1. Small GPT Intelligence Engine
- **Client-Side Nano GPT**: High-performance offline LLM inference running directly in browser with zero external key requirements.
- **One-Click Analytical Presets**: Pre-built prompt vectors for **2026-2027 Labor Forecasts**, **Layoff Vulnerability Assessments**, and **Cluster Upskilling Pivots**.
- **BYO Key Integration**: Easily connect external **OpenAI GPT-4o** or custom LLM endpoints via the built-in configuration modal.
- **Auto-Generated Country Briefings**: Click any nation on the map to instantly synthesize an executive briefing.

### 📊 2. Machine Learning Vector Clustering & PCA
- **K-Means Clustering**: Dynamically partition 38 OECD economies into $K=2 \dots 6$ structural archetypes based on Unemployment Rate, Tech Concentration, Hiring Growth, and Volatility.
- **2D PCA Projection**: Project high-dimensional economic vectors onto an interactive 2D scatter matrix ($PC_1$ vs $PC_2$).
- **Silhouette Score Evaluation**: Real-time cluster quality metric gauge and feature matrix comparison tables.

### ⚡ 3. Enterprise API Management Dashboard & Sandbox
- **API Key Management**: Create, copy, and revoke production and staging API secret keys (`emp_live_xxx`).
- **Real-Time Telemetry**: Live metric charts tracking Requests Per Second (RPS), p50/p95/p99 latency distribution, and HTTP status code breakdowns.
- **Interactive OpenAPI 3.0 Sandbox**: Test REST endpoints (`/v1/employment/live`, `/v1/clusters/vector-space`, `/v1/gpt/analyze`) live in your browser.
- **Multi-Language SDK Generator**: One-click code generation in **Python**, **JavaScript**, **cURL**, **Rust**, and **Go**.
- **Webhooks Manager**: Subscribe to event triggers (e.g. `layoff.spike_detected`).

### 🔬 4. SLM Science & Research Lab
- **CLAG Framework (Active Router)**: SLMs act as active memory organization routers, generating human-readable **Shared Pseudo-Labels** to prevent cross-topic interference in long-term memory systems.
- **Geometric Hallucination Detection**: Measures response variance in sentence-embedding space. Genuine SLM responses form dense clusters ($\text{Radius} \le 0.25$), whereas hallucinations exhibit spatial dispersion ($\text{Radius} > 0.45$).
- **PRISM Framework & Two-Stage Guardrails**: Distills 70B teacher LLM local geometry into lightweight 1.5B student models, utilizing a two-stage algorithm (Mini-batch K-Means + Johnson–Chvátal heuristic set-cover) for 88% latency reduction and provable per-sample quality control.

### 🔮 5. Macro Economic Policy Simulator (Monte Carlo Engine)
- Adjust Federal Reserve interest benchmark rates, AI automation speed indices, and global tech R&D spending.
- Run 1,000 Monte Carlo simulation paths predicting unemployment trajectories and cluster shifts 18 months ahead.

### ⌨️ 6. Keyboard Navigation Command Palette (`Cmd+K` / `Ctrl+K`)
- Instant search modal across all tabs, 38 OECD nations, API endpoints, and Small GPT prompts.

---

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |     OECD & Arbeitnow Data Feeds       |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +-------------------+-------------------+
                                  |  Employment Pulse Core React App     |
                                  +---------+-----------------+-----------+
                                            |                 |
                +---------------------------+                 +---------------------------+
                |                                                                         |
                v                                                                         v
+---------------+---------------+                                       +-----------------+---------------+
|   Small GPT Intelligence      |                                       |   K-Means & 2D PCA ML Engine   |
|   (Client-side Vector LLM)    |                                       |   (Unsupervised Clustering)   |
+---------------+---------------+                                       +-----------------+---------------+
                |                                                                         |
                +---------------------------+---------------------------------------------+
                                            |
                                            v
                                  +---------+-----------------+
                                  |   Developer API Gateway   |
                                  |   & OpenAPI Sandbox       |
                                  +---------------------------+
```

---

## 🚀 Quickstart

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### Installation & Launch

```bash
# Clone the repository
git clone https://github.com/your-username/employment-meter.git
cd employment-meter

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Build & Verification

```bash
# Production Build
npm run build

# Preview Production Build
npm run preview
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
