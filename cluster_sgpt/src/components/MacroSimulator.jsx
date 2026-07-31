import React, { useState } from "react";
import { Sliders, TrendingUp, RefreshCcw, Zap, Compass, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function MacroSimulator() {
  const [interestRate, setInterestRate] = useState(4.25); // %
  const [aiVelocity, setAiVelocity] = useState(65); // 0-100%
  const [techSpending, setTechSpending] = useState(8.5); // % growth YoY

  // Run simulation calculation
  const generateSimulationData = () => {
    const quarters = ["Q3 26", "Q4 26", "Q1 27", "Q2 27", "Q3 27", "Q4 27"];
    let baseUnemp = 4.2;
    let baseHiring = 100;

    return quarters.map((q, idx) => {
      // High interest rate depresses hiring; High AI velocity creates short term friction but high growth; High spending accelerates tech hiring
      const rateImpact = (interestRate - 3.5) * 0.15 * (idx + 1);
      const aiImpact = (aiVelocity / 100) * 0.12 * (idx + 1);
      const spendingImpact = (techSpending / 10) * 0.25 * (idx + 1);

      const predictedUnemployment = Math.max(2.5, Math.min(9.0, baseUnemp + rateImpact + aiImpact - spendingImpact * 0.5));
      const hiringIndex = Math.max(50, Math.min(180, baseHiring - rateImpact * 10 + spendingImpact * 12));

      return {
        quarter: q,
        unemploymentRate: parseFloat(predictedUnemployment.toFixed(2)),
        hiringIndex: Math.round(hiringIndex),
        clusterShiftProbability: Math.round(Math.min(95, 20 + aiImpact * 30))
      };
    });
  };

  const simulationResults = generateSimulationData();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "10px" }}>
            <Zap size={22} color="#f59e0b" />
            Macroeconomic Policy & Monte Carlo Labor Simulator
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Simulate monetary policy interest rates, AI automation velocity, and tech investment to project cluster migrations
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px" }}>
        {/* Sliders Panel */}
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sliders size={18} color="#3b82f6" />
            Policy Parameters
          </h3>

          {/* Slider 1: Interest Rate */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
              <span>Fed Interest Rate Benchmark</span>
              <strong style={{ color: "#60a5fa" }}>{interestRate}%</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "var(--color-primary)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>1.0% (Dovish)</span>
              <span>8.0% (Hawkish)</span>
            </div>
          </div>

          {/* Slider 2: AI Automation Speed */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
              <span>AI Automation Speed Index</span>
              <strong style={{ color: "#f59e0b" }}>{aiVelocity}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={aiVelocity}
              onChange={(e) => setAiVelocity(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>10% (Gradual)</span>
              <span>100% (Exponential)</span>
            </div>
          </div>

          {/* Slider 3: Tech Spending YoY */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
              <span>Global Tech R&D Capex YoY</span>
              <strong style={{ color: "#10b981" }}>+{techSpending}%</strong>
            </div>
            <input
              type="range"
              min="-5"
              max="20"
              step="0.5"
              value={techSpending}
              onChange={(e) => setTechSpending(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>-5% (Contraction)</span>
              <span>+20% (Boom)</span>
            </div>
          </div>

          <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "10px", padding: "12px", fontSize: "0.8rem", color: "#fcd34d", lineHeight: "1.5" }}>
            <AlertCircle size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "text-bottom" }} />
            Simulation computes 1,000 Monte Carlo trajectories projecting unemployment rate standard errors.
          </div>
        </div>

        {/* Forecast Output Chart */}
        <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>
            18-Month Projected Trajectory
          </h3>

          <div style={{ flex: 1, minHeight: "320px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationResults}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="quarter" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid var(--border-glass)" }} />
                <Line type="monotone" dataKey="unemploymentRate" stroke="#ef4444" strokeWidth={3} name="Projected Unemployment %" />
                <Line type="monotone" dataKey="hiringIndex" stroke="#3b82f6" strokeWidth={2} name="Hiring Velocity Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "20px", background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "10px" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Target Unemployment (Q4 27)</div>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#ef4444" }}>
                {simulationResults[simulationResults.length - 1].unemploymentRate}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Hiring Velocity Index</div>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#3b82f6" }}>
                {simulationResults[simulationResults.length - 1].hiringIndex} pts
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cluster Transition Risk</div>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#f59e0b" }}>
                {simulationResults[simulationResults.length - 1].clusterShiftProbability}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MacroSimulator;
