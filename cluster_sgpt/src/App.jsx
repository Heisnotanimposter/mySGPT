import React, { useState, useEffect } from "react";
import MapChart from "./components/MapChart";
import Ticker from "./components/Ticker";
import StatsCards from "./components/StatsCards";
import HistoryChart from "./components/HistoryChart";
import GptAnalyst from "./components/GptAnalyst";
import ClusterAnalysis from "./components/ClusterAnalysis";
import ApiDashboard from "./components/ApiDashboard";
import MacroSimulator from "./components/MacroSimulator";
import CommandPalette from "./components/CommandPalette";
import SlmScienceLab from "./components/SlmScienceLab";
import { fetchWorldBankStats, fetchLiveJobs, fetchLayoffSignals, fetchCountryHistory } from "./data/api";
import { Briefcase, Globe, Bot, Layers, Server, Zap, RefreshCcw, Command, Search, Sparkles, Microscope } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("pulse"); // "pulse", "gpt", "clusters", "api", "simulator"
  const [mapData, setMapData] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Cluster filter sync state
  const [selectedClusterFilter, setSelectedClusterFilter] = useState(null);

  // Command palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [stats, jobs, news] = await Promise.all([
      fetchWorldBankStats(),
      fetchLiveJobs(),
      fetchLayoffSignals()
    ]);

    const combined = [...news, ...jobs.slice(0, 5)];

    if (stats) setMapData(stats);
    setLiveEvents(combined);
    setLoading(false);
    setLastRefreshed(new Date());
  };

  const handleCountryClick = async (country) => {
    setSelectedCountry(country);
    setHistoryLoading(true);
    const history = await fetchCountryHistory(country.countryCode);
    setHistoryData(history);
    setHistoryLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 600000);

    const handleSelectEvent = (e) => {
      const country = mapData.find((c) => c.countryCode === e.detail);
      if (country) handleCountryClick(country);
    };
    document.addEventListener("selectCountry", handleSelectEvent);

    return () => {
      clearInterval(interval);
      document.removeEventListener("selectCountry", handleSelectEvent);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Main Glass Header */}
      <header
        className="glass-panel"
        style={{
          margin: "20px",
          padding: "16px 28px",
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          borderRadius: "var(--radius-xl)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, var(--color-primary), #60a5fa)",
              padding: "10px",
              borderRadius: "12px",
              boxShadow: `0 0 24px rgba(59, 130, 246, 0.5)`
            }}
          >
            <Briefcase color="#fff" size={22} />
          </div>
          <div>
            <h1
              style={{
                fontSize: "1.3rem",
                fontWeight: "800",
                background: "linear-gradient(90deg, #fff, #94a3b8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Employment Pulse <span style={{ color: "#60a5fa", fontWeight: "600" }}>AI</span>
            </h1>
            <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              OECD Macro Data • Small GPT • PCA Clustering • API Gateway
            </p>
          </div>
        </div>

        {/* Command Palette Trigger Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--border-glass)",
            color: "var(--text-muted)",
            padding: "8px 16px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <Search size={16} />
          <span>Quick Command Palette...</span>
          <span style={{ fontSize: "0.7rem", background: "rgba(255, 255, 255, 0.1)", padding: "2px 6px", borderRadius: "4px", color: "#fff" }}>
            ⌘K
          </span>
        </button>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={loadData}
            title="Manual Refresh"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              padding: "6px 12px",
              borderRadius: "8px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--border-glass)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            Sync Real Data
          </button>
        </div>
      </header>

      {/* Top Main Navigation Tabs Bar */}
      <nav style={{ maxWidth: "1600px", margin: "0 auto 20px", width: "100%", padding: "0 20px" }}>
        <div className="glass-panel" style={{ padding: "8px", display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-start" }}>
          {[
            { id: "pulse", label: "Global Pulse & Heatmap", icon: Globe },
            { id: "gpt", label: "Small GPT Intelligence", icon: Bot },
            { id: "clusters", label: "Vector Clustering & PCA", icon: Layers },
            { id: "science", label: "🔬 SLM Science Lab", icon: Microscope },
            { id: "api", label: "API Gateway & Dashboard", icon: Server },
            { id: "simulator", label: "Macro Policy Simulator", icon: Zap }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab-btn ${isTabActive ? "active" : ""}`}
              >
                <IconComp size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Body */}
      <main style={{ flex: 1, padding: "0 20px 40px", maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
        {loading && mapData.length === 0 ? (
          <div style={{ padding: "100px", textAlign: "center", color: "var(--text-muted)" }}>
            <RefreshCcw className="animate-spin" size={48} style={{ marginBottom: "20px" }} />
            <h3>Synchronizing with Real-World Labor Markets...</h3>
          </div>
        ) : (
          <>
            {/* TAB 1: GLOBAL PULSE & HEATMAP */}
            {activeTab === "pulse" && (
              <>
                <StatsCards data={mapData} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px" }}>
                  {/* Map Section */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div className="glass-panel" style={{ padding: "30px", minHeight: "600px", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div>
                          <h2 style={{ fontSize: "1.4rem", marginBottom: "4px" }}>OECD Real-Time Employment Rates</h2>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Factual unemployment trends across OECD member nations</p>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-hiring)" }}></div>
                            <span>Low Transition</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-layoff)" }}></div>
                            <span>High Transition</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-glass)", overflow: "hidden" }}>
                        <MapChart
                          data={mapData}
                          onCountryClick={handleCountryClick}
                          activeCountry={selectedCountry?.countryCode}
                        />
                      </div>
                    </div>

                    <HistoryChart
                      countryName={selectedCountry?.name}
                      data={historyData}
                      loading={historyLoading}
                    />
                  </div>

                  {/* Ticker & AI Briefing Sidebar */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <Ticker events={liveEvents} />

                    <div className="glass-panel" style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h3 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "1.1rem" }}>
                          <Sparkles size={18} color="var(--color-primary)" />
                          AI Country Briefing
                        </h3>
                        {selectedCountry ? (
                          <div style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
                            <p style={{ marginBottom: "10px" }}>
                              Selected: <strong>{selectedCountry.name}</strong> ({selectedCountry.countryCode})
                            </p>
                            <p style={{ color: "var(--text-muted)" }}>
                              Unemployment Rate: <code>{selectedCountry.value}%</code> ({selectedCountry.dominant.toUpperCase()})
                            </p>
                            <button
                              onClick={() => setActiveTab("gpt")}
                              style={{
                                marginTop: "16px",
                                background: "var(--color-primary)",
                                border: "none",
                                color: "#fff",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                width: "100%"
                              }}
                            >
                              Open Small GPT Deep-Dive
                            </button>
                          </div>
                        ) : (
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                            Click any country on the OECD global heatmap to view its historical trend lines and trigger an AI Small GPT analysis!
                          </p>
                        )}
                      </div>

                      <div style={{ marginTop: "20px" }}>
                        <a
                          href="https://www.arbeitnow.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "linear-gradient(45deg, var(--color-primary), #60a5fa)",
                            border: "none",
                            color: "#fff",
                            padding: "12px",
                            borderRadius: "var(--radius-md)",
                            fontWeight: "600",
                            cursor: "pointer",
                            textAlign: "center",
                            display: "block",
                            transition: "transform 0.2s"
                          }}
                        >
                          Browse Live Global Openings
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: SMALL GPT ANALYST */}
            {activeTab === "gpt" && <GptAnalyst selectedCountry={selectedCountry} />}

            {/* TAB 3: VECTOR CLUSTERING & PCA */}
            {activeTab === "clusters" && (
              <ClusterAnalysis
                rawCountryData={mapData}
                selectedClusterFilter={selectedClusterFilter}
                onSelectClusterFilter={setSelectedClusterFilter}
              />
            )}

            {/* TAB 4: SLM SCIENCE LAB */}
            {activeTab === "science" && <SlmScienceLab />}

            {/* TAB 4: API DASHBOARD & GATEWAY */}
            {activeTab === "api" && <ApiDashboard />}

            {/* TAB 5: MACRO SIMULATOR */}
            {activeTab === "simulator" && <MacroSimulator />}
          </>
        )}
      </main>

      {/* Floating Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onSelectCountry={(country) => handleCountryClick(country)}
        countryData={mapData}
      />

      {/* Footer */}
      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid var(--border-glass)" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          © 2026 Employment Pulse AI. Real-time OECD statistics, Small GPT vector inference, K-Means PCA Clustering, and Developer API Gateway.
        </p>
      </footer>
    </div>
  );
}

export default App;
