import React, { useState } from "react";
import { apiManagementStore } from "../services/apiManagementStore";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  Key, ShieldCheck, Play, Code, Webhook, Plus, Copy, Trash2, Check, RefreshCw, Server, Activity
} from "lucide-react";

function ApiDashboard() {
  const [activeTab, setActiveTab] = useState("keys"); // "keys", "telemetry", "sandbox", "webhooks"
  const [keys, setKeys] = useState(apiManagementStore.loadKeys());
  const [webhooks, setWebhooks] = useState(apiManagementStore.loadWebhooks());
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // New Key Modal state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState("Production");

  // Sandbox state
  const endpoints = apiManagementStore.getEndpoints();
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [sandboxResponse, setSandboxResponse] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [codeLang, setCodeLang] = useState("python");

  // Webhook state
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [whUrl, setWhUrl] = useState("");
  const [whEvent, setWhEvent] = useState("layoff.spike_detected");

  // Telemetry metrics
  const telemetry = apiManagementStore.getTelemetryMetrics();

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    apiManagementStore.generateKey(newKeyName, newKeyEnv);
    setKeys(apiManagementStore.loadKeys());
    setNewKeyName("");
    setShowKeyModal(false);
  };

  const handleRevokeKey = (id) => {
    apiManagementStore.revokeKey(id);
    setKeys(apiManagementStore.loadKeys());
  };

  const handleCopyKey = (keyText, id) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleExecuteSandbox = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setSandboxResponse(selectedEndpoint.responseExample);
      setIsExecuting(false);
    }, 450);
  };

  const handleAddWebhook = () => {
    if (!whUrl.trim()) return;
    apiManagementStore.addWebhook(whUrl, whEvent);
    setWebhooks(apiManagementStore.loadWebhooks());
    setWhUrl("");
    setShowWebhookModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Dashboard Sub-Header Navigation */}
      <div className="glass-panel" style={{ padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", padding: "10px", borderRadius: "12px", boxShadow: "0 0 16px rgba(16, 185, 129, 0.4)" }}>
            <Server color="#fff" size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700" }}>API Management Gateway</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Enterprise API Keys, Real-Time Request Telemetry, Interactive OpenAPI Sandbox & Webhooks
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", background: "rgba(0,0,0,0.3)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border-glass)" }}>
          {[
            { id: "keys", label: "API Keys", icon: Key },
            { id: "telemetry", label: "Live Telemetry", icon: Activity },
            { id: "sandbox", label: "OpenAPI Sandbox", icon: Play },
            { id: "webhooks", label: "Webhooks", icon: Webhook }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isTabActive ? "var(--color-primary)" : "transparent",
                  color: isTabActive ? "#fff" : "var(--text-muted)",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s"
                }}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: API KEYS MANAGER */}
      {activeTab === "keys" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Active API Credentials ({keys.length})</h3>
            <button
              onClick={() => setShowKeyModal(true)}
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                border: "none",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Plus size={16} />
              Generate API Key
            </button>
          </div>

          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-glass)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "12px" }}>Key Name</th>
                    <th style={{ padding: "12px" }}>API Secret</th>
                    <th style={{ padding: "12px" }}>Environment</th>
                    <th style={{ padding: "12px" }}>Rate Quota</th>
                    <th style={{ padding: "12px" }}>Status</th>
                    <th style={{ padding: "12px" }}>Created</th>
                    <th style={{ padding: "12px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k) => (
                    <tr key={k.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px", fontWeight: "600" }}>{k.name}</td>
                      <td style={{ padding: "12px" }}>
                        <code style={{ background: "rgba(0,0,0,0.4)", padding: "4px 8px", borderRadius: "6px", color: "#60a5fa" }}>
                          {k.key}
                        </code>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ background: k.environment === "Production" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)", color: k.environment === "Production" ? "#10b981" : "#f59e0b", padding: "2px 8px", borderRadius: "6px", fontWeight: "600", fontSize: "0.75rem" }}>
                          {k.environment}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>{k.rateLimit}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ color: k.status === "Active" ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                          ● {k.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-muted)" }}>{k.created}</td>
                      <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleCopyKey(k.key, k.id)}
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-glass)", color: "#fff", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          {copiedKeyId === k.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                          {copiedKeyId === k.id ? "Copied" : "Copy"}
                        </button>
                        {k.status === "Active" && (
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.75rem" }}
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE TELEMETRY METRICS */}
      {activeTab === "telemetry" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Top KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            <div className="glass-panel" style={{ padding: "20px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Requests / Sec (RPS)</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#3b82f6", marginTop: "4px" }}>1,248 req/s</div>
              <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "4px" }}>▲ +14% vs last hour</div>
            </div>
            <div className="glass-panel" style={{ padding: "20px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Latency p95</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#10b981", marginTop: "4px" }}>38 ms</div>
              <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "4px" }}>▼ -6ms optimization</div>
            </div>
            <div className="glass-panel" style={{ padding: "20px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Success Rate</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#10b981", marginTop: "4px" }}>99.88%</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>SLA Compliant</div>
            </div>
            <div className="glass-panel" style={{ padding: "20px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Active API Keys</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#8b5cf6", marginTop: "4px" }}>
                {keys.filter((k) => k.status === "Active").length} Active
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Global Ingestion</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px" }}>
            {/* RPS & Latency Charts */}
            <div className="glass-panel" style={{ padding: "24px", minHeight: "380px" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "16px" }}>
                Live Request Latency Distribution (p50 / p95 / p99)
              </h3>
              <div style={{ width: "100%", height: "280px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetry.latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="time" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" unit="ms" />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid var(--border-glass)" }} />
                    <Line type="monotone" dataKey="p50" stroke="#10b981" strokeWidth={2} name="p50 (Median)" />
                    <Line type="monotone" dataKey="p95" stroke="#3b82f6" strokeWidth={2} name="p95" />
                    <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} name="p99 (Tail)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Code Pie */}
            <div className="glass-panel" style={{ padding: "24px", minHeight: "380px" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "700", marginBottom: "16px" }}>HTTP Status Distribution</h3>
              <div style={{ width: "100%", height: "240px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={telemetry.statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                      {telemetry.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid var(--border-glass)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "0.75rem", marginTop: "10px" }}>
                {telemetry.statusDistribution.map((st) => (
                  <div key={st.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: st.color }}></div>
                    <span>{st.name} ({st.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OPENAPI SANDBOX & CODE GENERATOR */}
      {activeTab === "sandbox" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Request Test Harness */}
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Interactive OpenAPI 3.0 Playground</h3>
            
            {/* Endpoint Selector */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>Target Endpoint</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {endpoints.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setSelectedEndpoint(ep);
                      setSandboxResponse(null);
                    }}
                    style={{
                      background: selectedEndpoint.id === ep.id ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.02)",
                      border: selectedEndpoint.id === ep.id ? "1px solid var(--color-primary)" : "1px solid var(--border-glass)",
                      padding: "12px",
                      borderRadius: "8px",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justify: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "700", color: ep.method === "GET" ? "#10b981" : "#3b82f6", marginRight: "8px", fontSize: "0.8rem" }}>
                        {ep.method}
                      </span>
                      <code style={{ fontSize: "0.85rem", color: "#fff" }}>{ep.path}</code>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{ep.summary}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecuteSandbox}
              disabled={isExecuting}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                border: "none",
                color: "#fff",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: isExecuting ? "not-allowed" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px"
              }}
            >
              {isExecuting ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
              {isExecuting ? "Executing Request..." : "Send Sandbox Request"}
            </button>

            {/* Sandbox Response Viewer */}
            <div style={{ marginTop: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "600", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                <span>Response Payload</span>
                {sandboxResponse && <span style={{ color: "#10b981" }}>200 OK (24ms)</span>}
              </div>
              <pre style={{ flex: 1, minHeight: "180px", background: "#090d16", border: "1px solid var(--border-glass)", padding: "16px", borderRadius: "8px", overflow: "auto", fontSize: "0.8rem", color: "#60a5fa" }}>
                {sandboxResponse ? JSON.stringify(sandboxResponse, null, 2) : "// Click 'Send Sandbox Request' to inspect API response payload."}
              </pre>
            </div>
          </div>

          {/* Code Snippet Generator */}
          <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Code size={18} color="#8b5cf6" />
              SDK Code Generator
            </h3>

            {/* Language Selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {["python", "javascript", "curl", "rust", "go"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCodeLang(lang)}
                  style={{
                    background: codeLang === lang ? "var(--color-primary)" : "rgba(255,255,255,0.04)",
                    color: codeLang === lang ? "#fff" : "var(--text-muted)",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    fontWeight: "600"
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            <pre style={{ flex: 1, background: "#090d16", border: "1px solid var(--border-glass)", padding: "16px", borderRadius: "8px", overflow: "auto", fontSize: "0.85rem", color: "#e2e8f0", lineHeight: "1.5" }}>
              {apiManagementStore.generateCodeSnippet(selectedEndpoint.path, selectedEndpoint.method, keys[0]?.key || "emp_live_xxx", codeLang)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: WEBHOOKS CONFIGURATOR */}
      {activeTab === "webhooks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Event Subscriptions & Webhook Triggers</h3>
            <button
              onClick={() => setShowWebhookModal(true)}
              style={{
                background: "var(--color-primary)",
                border: "none",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Plus size={16} />
              Add Webhook
            </button>
          </div>

          <div className="glass-panel" style={{ padding: "24px" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-glass)", color: "var(--text-muted)" }}>
                    <th style={{ padding: "12px" }}>Target Endpoint URL</th>
                    <th style={{ padding: "12px" }}>Trigger Event</th>
                    <th style={{ padding: "12px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {webhooks.map((wh) => (
                    <tr key={wh.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "12px" }}><code>{wh.url}</code></td>
                      <td style={{ padding: "12px", color: "#60a5fa" }}>{wh.event}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ color: "#10b981", fontWeight: "600" }}>● {wh.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Generate Key Modal */}
      {showKeyModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: "32px", width: "420px", background: "#0f172a", border: "1px solid var(--color-primary)" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Provision New API Key</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>Key Identifier Name</label>
              <input
                type="text"
                placeholder="e.g. Analytics Ingestion Pipeline"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "#1e293b", border: "1px solid var(--border-glass)", color: "#fff", borderRadius: "8px" }}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>Target Environment</label>
              <select
                value={newKeyEnv}
                onChange={(e) => setNewKeyEnv(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "#1e293b", border: "1px solid var(--border-glass)", color: "#fff", borderRadius: "8px" }}
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button onClick={() => setShowKeyModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleCreateKey} style={{ background: "var(--color-primary)", border: "none", color: "#fff", padding: "10px 18px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                Generate Secret
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {showWebhookModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: "32px", width: "450px", background: "#0f172a", border: "1px solid var(--color-primary)" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Register New Webhook</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>Webhook Target URL</label>
              <input
                type="url"
                placeholder="https://api.yourdomain.com/webhooks"
                value={whUrl}
                onChange={(e) => setWhUrl(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "#1e293b", border: "1px solid var(--border-glass)", color: "#fff", borderRadius: "8px" }}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>Subscribe to Event</label>
              <select
                value={whEvent}
                onChange={(e) => setWhEvent(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "#1e293b", border: "1px solid var(--border-glass)", color: "#fff", borderRadius: "8px" }}
              >
                <option value="layoff.spike_detected">layoff.spike_detected</option>
                <option value="cluster.migration_triggered">cluster.migration_triggered</option>
                <option value="unemployment.anomaly_flagged">unemployment.anomaly_flagged</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button onClick={() => setShowWebhookModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleAddWebhook} style={{ background: "var(--color-primary)", border: "none", color: "#fff", padding: "10px 18px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                Register Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiDashboard;
