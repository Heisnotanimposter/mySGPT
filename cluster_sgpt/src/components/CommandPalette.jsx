import React, { useState, useEffect } from "react";
import { Search, Globe, Bot, Layers, Server, Zap, ArrowRight, Command, X, Microscope } from "lucide-react";

function CommandPalette({ isOpen, onClose, onSelectTab, onSelectCountry, countryData = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const NAVIGATION_ITEMS = [
    { type: "tab", id: "pulse", label: "Global Employment Pulse & Heatmap", icon: Globe, cat: "Navigation" },
    { type: "tab", id: "gpt", label: "Small GPT Intelligence Analyst", icon: Bot, cat: "Navigation" },
    { type: "tab", id: "clusters", label: "Economic Vector Clustering & PCA", icon: Layers, cat: "Navigation" },
    { type: "tab", id: "science", label: "SLM Science Lab (CLAG, Geometric, PRISM)", icon: Microscope, cat: "Navigation" },
    { type: "tab", id: "api", label: "API Gateway & Developer Console", icon: Server, cat: "Navigation" },
    { type: "tab", id: "simulator", label: "Macro Economic Policy Simulator", icon: Zap, cat: "Navigation" }
  ];

  const countryItems = countryData.map((c) => ({
    type: "country",
    country: c,
    label: `${c.name} (${c.countryCode}) - ${c.value}% Unemployment`,
    icon: Globe,
    cat: "Nations"
  }));

  const allItems = [...NAVIGATION_ITEMS, ...countryItems];

  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8);

  const handleItemClick = (item) => {
    if (item.type === "tab") {
      onSelectTab(item.id);
    } else if (item.type === "country") {
      onSelectCountry(item.country);
      onSelectTab("pulse");
    }
    onClose();
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.75)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "120px", zIndex: 2000 }}>
      <div className="glass-panel" style={{ width: "600px", background: "#0f172a", border: "1px solid var(--color-primary)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
        {/* Search Input Bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border-glass)", gap: "12px" }}>
          <Search size={20} color="var(--text-muted)" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, nation, or jump to tab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: "1rem", outline: "none" }}
          />
          <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", color: "var(--text-muted)" }}>
            ESC
          </span>
          <X size={18} color="var(--text-muted)" style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        {/* Results List */}
        <div style={{ maxHeight: "360px", overflowY: "auto", padding: "10px" }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No matching commands or nations found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleItemClick(item)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(59, 130, 246, 0.15)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <IconComp size={18} color="var(--color-primary)" />
                    <span style={{ fontSize: "0.9rem", color: "#fff" }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.cat}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
