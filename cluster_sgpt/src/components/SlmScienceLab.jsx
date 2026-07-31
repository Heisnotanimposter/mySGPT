import React, { useState } from "react";
import { clagRouterEngine } from "../services/clagRouterEngine";
import { geometricAnalyzer } from "../services/geometricAnalyzer";
import { prismEngine } from "../services/prismEngine";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { Microscope, Cpu, ShieldCheck, GitMerge, Activity, ArrowRight, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

function SlmScienceLab() {
  const [activeSubTab, setActiveSubTab] = useState("clag"); // "clag", "geometric", "prism"

  // CLAG State
  const [memoryInput, setMemoryInput] = useState("AI infrastructure funding surge in Q3 software engineering");
  const [routedResult, setRoutedResult] = useState(clagRouterEngine.routeMemoryNote("AI infrastructure funding surge in Q3 software engineering"));

  // Geometric Hallucination State
  const [promptText, setPromptText] = useState("Predict tech layoff signals for 2026 Q4");
  const [sampleResponse, setSampleResponse] = useState("Tech layoff signals indicate stabilization around AI infra, with high demand in machine learning hardware.");
  const [geoAnalysis, setGeoAnalysis] = useState(geometricAnalyzer.analyzeResponseGeometry("Predict tech layoff signals for 2026 Q4", "Tech layoff signals indicate stabilization around AI infra, with high demand in machine learning hardware."));

  // PRISM State
  const prismMetrics = prismEngine.getMetrics();
  const prismOptimization = prismEngine.runTwoStageInferenceOptimization();

  const handleRouteMemory = () => {
    if (!memoryInput.trim()) return;
    const res = clagRouterEngine.routeMemoryNote(memoryInput);
    setRoutedResult(res);
  };

  const handleAnalyzeGeometry = () => {
    const res = geometricAnalyzer.analyzeResponseGeometry(promptText, sampleResponse);
    setGeoAnalysis(res);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)", padding: "10px", borderRadius: "12px", boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)" }}>
            <Microscope color="#fff" size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "800" }}>SLM Science & Research Lab</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Active Routing (CLAG), Geometric Hallucination Analysis, and PRISM Teacher-Student Distillation
            </p>
          </div>
        </div>

        {/* SubTab Navigation */}
        <div style={{ display: "flex", gap: "8px", background: "rgba(0,0,0,0.3)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
          {[
            { id: "clag", label: "1. CLAG Active Router", icon: GitMerge },
            { id: "geometric", label: "2. Geometric Hallucination", icon: Activity },
            { id: "prism", label: "3. PRISM & Guardrails", icon: Cpu }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  background: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "#fff" : "var(--text-muted)",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <IconComp size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: CLAG FRAMEWORK & SHARED PSEUDO-LABELS */}
      {activeSubTab === "clag" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Agent Router Interactive Harness */}
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <GitMerge size={18} color="#3b82f6" />
              CLAG Agentic Routing & Shared Pseudo-Labeler
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              The <strong>CLAG Framework</strong> uses Small Language Models (SLMs) as active routing agents. It assigns memory notes to relevant semantic clusters to reduce cross-topic interference in long-term memory.
            </p>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>Input Memory Note / Query</label>
              <textarea
                rows={3}
                value={memoryInput}
                onChange={(e) => setMemoryInput(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "#090d16", border: "1px solid var(--border-glass)", color: "#fff", borderRadius: "8px", fontSize: "0.9rem" }}
              />
            </div>

            <button
              onClick={handleRouteMemory}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                border: "none",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Route Memory Note via SLM
            </button>

            {routedResult && (
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-primary)", padding: "16px", borderRadius: "10px", marginTop: "10px" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Generated Shared Pseudo-Label</div>
                <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#60a5fa", marginTop: "4px" }}>
                  "{routedResult.assignedPseudoLabel}"
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px", fontSize: "0.8rem" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Target Cluster:</span> <code>{routedResult.assignedClusterId}</code>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Routing Confidence:</span> <strong>{(routedResult.routingConfidence * 100).toFixed(0)}%</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Interference Reduction:</span> <strong style={{ color: "#10b981" }}>{routedResult.agentMetadata.interferenceReduction}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Routing Latency:</span> <code>{routedResult.agentMetadata.routingLatencyMs} ms</code>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Memory Clusters State */}
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Active Memory Organization Clusters</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {clagRouterEngine.getClusters().map((c) => (
                <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", padding: "14px", borderRadius: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "700", color: "#fff", fontSize: "0.9rem" }}>{c.pseudoLabel}</span>
                    <span style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", padding: "2px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "600" }}>
                      {c.notesCount} Notes
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
                    Topic Domain: {c.topic} | Cluster ID: <code>{c.id}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: GEOMETRIC HALLUCINATION DETECTION */}
      {activeSubTab === "geometric" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "24px" }}>
          {/* Hallucination Detector Inputs & Scatter Plot */}
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={18} color="#ec4899" />
              Geometric Dispersion Analysis in Sentence-Embedding Space
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Based on <em>A Geometric Analysis of Small-sized Language Model Hallucinations</em>. Genuine SLM responses cluster tightly in vector space ($\text{Dispersion} \le 0.25$), while hallucinated responses scatter widely.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>Prompt</label>
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  style={{ width: "100%", padding: "8px", background: "#090d16", border: "1px solid var(--border-glass)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>SLM Response</label>
                <textarea
                  rows={2}
                  value={sampleResponse}
                  onChange={(e) => setSampleResponse(e.target.value)}
                  style={{ width: "100%", padding: "8px", background: "#090d16", border: "1px solid var(--border-glass)", color: "#fff", borderRadius: "6px", fontSize: "0.85rem" }}
                />
              </div>

              <button
                onClick={handleAnalyzeGeometry}
                style={{
                  background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                  border: "none",
                  color: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Compute Geometric Dispersion Radius
              </button>
            </div>

            {/* Dispersion Scatter Plot */}
            <div style={{ height: "240px", marginTop: "10px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis type="number" dataKey="x" domain={[0, 0.6]} stroke="var(--text-muted)" />
                  <YAxis type="number" dataKey="y" domain={[0, 0.6]} stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid var(--border-glass)" }} />
                  <Scatter name="Stochastic Vectors" data={geoAnalysis.sampleVectors}>
                    {geoAnalysis.sampleVectors.map((v, i) => (
                      <Cell key={i} fill={geoAnalysis.isHallucination ? "#ef4444" : "#10b981"} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analysis Metrics */}
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Geometric Verdict</h3>

            <div style={{ background: geoAnalysis.isHallucination ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)", border: `1px solid ${geoAnalysis.isHallucination ? "#ef4444" : "#10b981"}`, padding: "16px", borderRadius: "10px" }}>
              <div style={{ fontWeight: "800", fontSize: "1.1rem", color: geoAnalysis.isHallucination ? "#ef4444" : "#10b981" }}>
                {geoAnalysis.statusBadge}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
                {geoAnalysis.geometricHypothesis}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Spatial Dispersion Radius ($D_r$):</span>
                <strong style={{ color: geoAnalysis.isHallucination ? "#ef4444" : "#10b981" }}>
                  {geoAnalysis.dispersionRadius}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Factual Grounding Score:</span>
                <strong>{(geoAnalysis.confidenceScore * 100).toFixed(0)}%</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Label Propagation Matrix:</span>
                <span>{geoAnalysis.labelPropagationDensity}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PRISM DISTILLATION & TWO-STAGE GUARDRAILS */}
      {activeSubTab === "prism" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* PRISM Framework Overview */}
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <Cpu size={18} color="#8b5cf6" />
              PRISM Teacher-Student Distillation Metrics
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Fine-tunes lightweight sentence encoding models using sparse labels from larger teacher LLMs (70B), optimizing local geometry for tight cluster separability.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Teacher Model</div>
                <div style={{ fontSize: "1rem", fontWeight: "700", color: "#8b5cf6" }}>{prismMetrics.teacherModel}</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Lightweight Student</div>
                <div style={{ fontSize: "1rem", fontWeight: "700", color: "#10b981" }}>{prismMetrics.studentModel}</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Separability Ratio</div>
                <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#3b82f6" }}>{prismMetrics.clusterSeparabilityRatio}</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cost Savings</div>
                <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#10b981" }}>{prismMetrics.costSavings}</div>
              </div>
            </div>
          </div>

          {/* Two-Stage Guardrail Algorithm */}
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Two-Stage Algorithm with Provable Guardrails</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Combines Mini-batch K-Means with the Johnson–Chvátal set-cover heuristic to manage large-scale data and cut down inference latency.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid #3b82f6", padding: "14px", borderRadius: "10px" }}>
                <div style={{ fontWeight: "700", color: "#60a5fa", fontSize: "0.9rem" }}>Stage 1: {prismOptimization.stage1.algorithm}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Passed: {prismOptimization.stage1.passedSamples} / {prismOptimization.stage1.inputSamples} samples ({prismOptimization.stage1.latencyMs}ms)
                </div>
              </div>

              <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", padding: "14px", borderRadius: "10px" }}>
                <div style={{ fontWeight: "700", color: "#10b981", fontSize: "0.9rem" }}>Stage 2: {prismOptimization.stage2.algorithm}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  Verified: {prismOptimization.stage2.passedSamples} samples | Pruned Outliers: {prismOptimization.stage2.prunedOutliers} ({prismOptimization.stage2.latencyMs}ms)
                </div>
              </div>
            </div>

            <div style={{ marginTop: "10px", background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", fontSize: "0.85rem", color: "#10b981", fontWeight: "600" }}>
              ✔ Guardrail Optimization Status: {prismOptimization.summary.totalEfficiencyGain}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SlmScienceLab;
