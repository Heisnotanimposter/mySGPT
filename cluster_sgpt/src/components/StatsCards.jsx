import React from "react";
import { TrendingUp, TrendingDown, Users, Globe } from "lucide-react";

const StatsCards = ({ data }) => {
  // If data is not ready, show placeholders
  if (!data || data.length === 0) return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "30px", opacity: 0.5 }}>
      {[1, 2, 3].map(i => <div key={i} className="glass-panel" style={{ height: "100px" }}></div>)}
    </div>
  );

  const avgUnemployment = data.reduce((acc, d) => acc + parseFloat(d.value), 0) / data.length;
  const hiringCount = data.filter(d => d.dominant === 'hiring').length;
  const percentage = (hiringCount / data.length) * 100;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "30px" }}>
      <div className="glass-panel" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px", borderBottom: "4px solid var(--color-primary)" }}>
        <div style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", padding: "12px", borderRadius: "var(--radius-md)" }}>
          <Globe color="var(--color-primary)" size={28} />
        </div>
        <div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>OECD Avg Unemployment</span>
          <h2 style={{ fontSize: "2rem", color: "#fff", marginTop: "4px" }}>{avgUnemployment.toFixed(1)}%</h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px", borderBottom: "4px solid var(--color-hiring)" }}>
        <div style={{ backgroundColor: "var(--color-hiring-glow)", padding: "12px", borderRadius: "var(--radius-md)" }}>
          <TrendingUp color="var(--color-hiring)" size={28} />
        </div>
        <div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>Expansion Markets</span>
          <h2 style={{ fontSize: "2rem", color: "#fff", marginTop: "4px" }}>{hiringCount} <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "400" }}>Countries</span></h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "24px", minWidth: "300px", gridColumn: "span 2" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "12px" }}>
          <div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>Global Hiring Confidence</span>
            <h3 style={{ fontSize: "1.5rem", color: "#fff", marginTop: "4px" }}>
              {percentage > 50 ? "Positive Market Outlook" : "Economic Caution"}
            </h3>
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: "700", color: percentage > 50 ? 'var(--color-hiring)' : 'var(--color-layoff)' }}>
            {percentage.toFixed(1)}% CONFIDENCE
          </span>
        </div>
        
        {/* The Meter/Gauge Bar */}
        <div style={{ position: "relative", height: "12px", background: "rgba(255,255,255,0.1)", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ 
            position: "absolute", 
            left: 0, 
            top: 0, 
            height: "100%", 
            width: `${percentage}%`, 
            background: `linear-gradient(90deg, var(--color-hiring), #4ade80)`,
            boxShadow: `0 0 10px var(--color-hiring-glow)`,
            transition: "width 1s ease-in-out"
          }}></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span>LAYOFF RISK INDICATOR</span>
          <span>RECRUITMENT STRENGTH</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
