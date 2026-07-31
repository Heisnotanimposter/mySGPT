import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { generateRecentEvents } from "../data/mockData";

const Ticker = ({ events }) => {
  return (
    <div className="glass-panel" style={{ 
      padding: "24px", 
      height: "450px", 
      overflowY: "auto", 
      display: "flex", 
      flexDirection: "column", 
      gap: "16px",
      minWidth: "300px"
    }}>
      <h3 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontSize: "1.1rem" }}>
        Live Market Signals
        <span style={{ fontSize: "0.75rem", color: "var(--color-primary)", border: "1px solid var(--color-primary)", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>REAL-TIME</span>
      </h3>
      {(!events || events.length === 0) ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Synchronizing signals...
        </div>
      ) : (
        events.map((event) => (
          <div key={event.id} className="animate-fade-in" style={{
            padding: "16px",
            borderRadius: "var(--radius-md)",
            background: "rgba(255,255,255,0.025)",
            borderLeft: `4px solid ${event.type === 'hiring' ? 'var(--color-hiring)' : 'var(--color-layoff)'}`,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            transition: "all 0.2s"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontWeight: "700", color: "#fff", fontSize: "1rem" }}>{event.company}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", backgroundColor: "var(--border-glass)", padding: "2px 6px", borderRadius: "4px" }}>
                {event.type.toUpperCase()}
              </span>
            </div>
            
            <div style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
              {event.type === 'hiring' ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <TrendingUp size={14} color="var(--color-hiring)" />
                  <span style={{ color: "var(--color-hiring)", fontWeight: "600" }}>Recruiting: {event.role}</span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <TrendingDown size={14} color="var(--color-layoff)" />
                  <span style={{ color: "var(--color-layoff)", fontWeight: "600" }}>{event.headline || 'Layoff Signal Detected'}</span>
                </div>
              )}
            </div>
            
            <a href={event.link} target="_blank" rel="noopener noreferrer" style={{ 
              marginTop: "4px", 
              fontSize: "0.75rem", 
              color: "var(--color-primary)", 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "4px",
              fontWeight: "600"
            }}>
              {event.type === 'hiring' ? 'Apply Directly' : 'View Source'} <ExternalLink size={10} />
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default Ticker;
