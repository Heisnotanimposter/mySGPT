import React, { useState, useEffect } from "react";
import { clusteringEngine } from "../services/clusteringEngine";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { Layers, Sliders, Activity, Info, Filter, ArrowUpRight } from "lucide-react";

function ClusterAnalysis({ rawCountryData, onSelectClusterFilter, selectedClusterFilter }) {
  const [kClusters, setKClusters] = useState(4);
  const [clusterResults, setClusterResults] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (rawCountryData && rawCountryData.length > 0) {
      const results = clusteringEngine.processClusters(rawCountryData, kClusters);
      setClusterResults(results);
    }
  }, [rawCountryData, kClusters]);

  if (!clusterResults) {
    return (
      <div style={{ padding: "80px", textAlign: "center", color: "var(--text-muted)" }}>
        <h3>Initializing Vector Space & K-Means Engine...</h3>
      </div>
    );
  }

  const { samples, clustersSummary, silhouetteScore } = clusterResults;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: "#0f172a", border: `1px solid ${data.color}`, padding: "12px 16px", borderRadius: "10px", color: "#fff", fontSize: "0.85rem" }}>
          <div style={{ fontWeight: "700", marginBottom: "4px", color: data.color }}>
            {data.name} ({data.countryCode})
          </div>
          <div>Cluster: <strong>{data.clusterId}</strong></div>
          <div>Unemployment Rate: <code>{data.unemployment}%</code></div>
          <div>Tech Concentration: <code>{data.techScore}/10</code></div>
          <div>Hiring Growth: <code>{data.hiringGrowth}%</code></div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
            PCA Vector: [{data.x}, {data.y}]
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header & Slider Controls */}
      <div className="glass-panel" style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
            <Layers size={22} color="var(--color-primary)" />
            OECD Economic Vector Clustering & PCA Dimensionality Reduction
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Unsupervised machine learning analysis partitioning 38 OECD member nations into distinct structural archetypes
          </p>
        </div>

        {/* K Slider */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", background: "rgba(0,0,0,0.3)", padding: "12px 20px", borderRadius: "12px", border: "1px solid var(--border-glass)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sliders size={18} color="#60a5fa" />
            <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>Clusters (K): {kClusters}</span>
          </div>
          <input
            type="range"
            min="2"
            max="6"
            value={kClusters}
            onChange={(e) => setKClusters(parseInt(e.target.value))}
            style={{ accentColor: "var(--color-primary)", cursor: "pointer", width: "120px" }}
          />

          <div style={{ borderLeft: "1px solid var(--border-glass)", paddingLeft: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} color={parseFloat(silhouetteScore) > 0.4 ? "#10b981" : "#f59e0b"} />
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Silhouette Score</div>
              <div style={{ fontSize: "0.95rem", fontWeight: "700", color: parseFloat(silhouetteScore) > 0.4 ? "#10b981" : "#f59e0b" }}>
                {silhouetteScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Vector Space & Cluster Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "24px" }}>
        {/* PCA 2D Scatter Chart */}
        <div className="glass-panel" style={{ padding: "24px", minHeight: "520px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>2D Principal Component Vector Space</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                $PC_1$ (Tech Growth & Hiring Velocity) vs $PC_2$ (Unemployment & Volatility)
              </p>
            </div>
            {selectedClusterFilter !== null && (
              <button
                onClick={() => onSelectClusterFilter(null)}
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                Clear Cluster Filter
              </button>
            )}
          </div>

          <div style={{ flex: 1, minHeight: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis type="number" dataKey="x" name="PC1 (Growth Vector)" stroke="var(--text-muted)" />
                <YAxis type="number" dataKey="y" name="PC2 (Risk Vector)" stroke="var(--text-muted)" />
                <Tooltip content={<CustomTooltip />} />
                <Scatter name="OECD Nations" data={samples}>
                  {samples.map((entry, index) => {
                    const isFiltered = selectedClusterFilter === null || selectedClusterFilter === entry.clusterId;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={isFiltered ? 0.95 : 0.15}
                        r={isFiltered ? 8 : 4}
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cluster Summaries List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Cluster Archetypes ({kClusters})</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", maxHeight: "480px", paddingRight: "4px" }}>
            {clustersSummary.map((cluster) => {
              const isSelected = selectedClusterFilter === cluster.clusterId;
              return (
                <div
                  key={cluster.clusterId}
                  className="glass-panel"
                  onClick={() => onSelectClusterFilter(isSelected ? null : cluster.clusterId)}
                  style={{
                    padding: "16px",
                    cursor: "pointer",
                    border: isSelected ? `2px solid ${cluster.color}` : "1px solid var(--border-glass)",
                    background: isSelected ? "rgba(30, 41, 59, 0.9)" : "rgba(30, 41, 59, 0.4)",
                    transition: "all 0.2s",
                    borderRadius: "12px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: cluster.color }}></div>
                      <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>{cluster.name}</span>
                    </div>
                    <span style={{ background: `${cluster.color}22`, color: cluster.color, padding: "2px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "600" }}>
                      {cluster.badge}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px", lineHeight: "1.4" }}>
                    {cluster.description}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "0.75rem", background: "rgba(0,0,0,0.2)", padding: "8px", borderRadius: "8px" }}>
                    <div>
                      <div style={{ color: "var(--text-muted)" }}>Count</div>
                      <div style={{ fontWeight: "700" }}>{cluster.count} Nations</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)" }}>Avg Unemp</div>
                      <div style={{ fontWeight: "700", color: parseFloat(cluster.avgUnemployment) > 6 ? "#ef4444" : "#10b981" }}>
                        {cluster.avgUnemployment}%
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)" }}>Avg Tech</div>
                      <div style={{ fontWeight: "700" }}>{cluster.avgTechScore}/10</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Country Cluster Table */}
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>
          OECD Cluster Membership Matrix ({samples.length} Nations)
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-glass)", color: "var(--text-muted)" }}>
                <th style={{ padding: "12px" }}>Country</th>
                <th style={{ padding: "12px" }}>Code</th>
                <th style={{ padding: "12px" }}>Assigned Cluster</th>
                <th style={{ padding: "12px" }}>Unemployment</th>
                <th style={{ padding: "12px" }}>Tech Score</th>
                <th style={{ padding: "12px" }}>Hiring Growth</th>
                <th style={{ padding: "12px" }}>2D Vector [PC1, PC2]</th>
              </tr>
            </thead>
            <tbody>
              {samples
                .filter((s) => selectedClusterFilter === null || selectedClusterFilter === s.clusterId)
                .map((sample) => (
                  <tr
                    key={sample.countryCode}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px", fontWeight: "600" }}>{sample.name}</td>
                    <td style={{ padding: "12px" }}><code>{sample.countryCode}</code></td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ color: sample.color, fontWeight: "600" }}>
                        Cluster {sample.clusterId}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>{sample.unemployment}%</td>
                    <td style={{ padding: "12px" }}>{sample.techScore}/10</td>
                    <td style={{ padding: "12px" }}>{sample.hiringGrowth}%</td>
                    <td style={{ padding: "12px", color: "var(--text-muted)" }}>
                      [{sample.x}, {sample.y}]
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClusterAnalysis;
