import React, { useState } from "react";
import { smallGptEngine, PRESET_PROMPTS } from "../services/smallGptEngine";
import { Bot, Send, Sparkles, Key, CheckCircle, RefreshCw, Cpu, Layers } from "lucide-react";

function GptAnalyst({ selectedCountry }) {
  const [inputPrompt, setInputPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "small-gpt",
      text: "👋 Welcome to **Small GPT Intelligence Engine**. I am running client-side vector inference over 38 OECD countries and real-time tech employment feeds. Ask me anything or select a preset prompt below!",
      category: "Initialization",
      confidence: 0.99,
      timestamp: new Date().toLocaleTimeString(),
      tokensUsed: 42
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const [apiKeyInput, setApiKeyInput] = useState(smallGptEngine.getSettings().apiKey);
  const [providerInput, setProviderInput] = useState(smallGptEngine.getSettings().provider);

  const handleSend = async (promptText) => {
    const textToSubmit = promptText || inputPrompt;
    if (!textToSubmit.trim() || isGenerating) return;

    const userMsg = {
      sender: "user",
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInputPrompt("");
    setIsGenerating(true);

    try {
      const response = await smallGptEngine.generateResponse(textToSubmit, {
        country: selectedCountry
      });

      const gptMsg = {
        sender: "small-gpt",
        text: response.text,
        category: response.category,
        confidence: response.confidence,
        timestamp: response.timestamp,
        tokensUsed: response.tokensUsed
      };

      setMessages((prev) => [...prev, gptMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "small-gpt",
          text: "⚠️ An error occurred while generating response. Reverting to local inference cache.",
          category: "System Alert",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveConfig = () => {
    smallGptEngine.setApiKey(apiKeyInput, providerInput);
    setShowConfigModal(false);
  };

  const handleCountryBriefingClick = async () => {
    if (!selectedCountry) return;
    handleSend(`Provide executive briefing for ${selectedCountry.name}`);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
      {/* Main Chat Interface */}
      <div className="glass-panel" style={{ padding: "28px", display: "flex", flexDirection: "column", height: "700px" }}>
        {/* Chat Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid var(--border-glass)", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", padding: "10px", borderRadius: "12px", boxShadow: "0 0 16px rgba(139, 92, 246, 0.4)" }}>
              <Bot color="#fff" size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                Small GPT Labor Analyst <span style={{ fontSize: "0.7rem", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", padding: "2px 8px", borderRadius: "10px", marginLeft: "6px" }}>v2.4 Nano</span>
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Client-side transformer model & real-time economic reasoning engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfigModal(true)}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-glass)",
              color: "var(--text-muted)",
              padding: "8px 14px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              fontSize: "0.85rem",
              transition: "all 0.2s"
            }}
          >
            <Key size={16} />
            {smallGptEngine.getSettings().apiKey ? "Custom API Active" : "Local GPT Mode"}
          </button>
        </div>

        {/* Selected Country Context Bar */}
        {selectedCountry && (
          <div style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "10px", padding: "10px 16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem" }}>
              Active Country Focus: <strong>{selectedCountry.name} ({selectedCountry.countryCode})</strong> - Unemployment Rate: <code>{selectedCountry.value}%</code>
            </span>
            <button
              onClick={handleCountryBriefingClick}
              disabled={isGenerating}
              style={{
                background: "var(--color-primary)",
                border: "none",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Auto Briefing
            </button>
          </div>
        )}

        {/* Chat Feed */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.sender === "user" ? "flex-end" : "flex-start"
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  padding: "16px 20px",
                  borderRadius: "14px",
                  background: msg.sender === "user" ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "rgba(30, 41, 59, 0.7)",
                  border: msg.sender === "user" ? "none" : "1px solid var(--border-glass)",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  fontSize: "0.92rem",
                  lineHeight: "1.6"
                }}
              >
                {msg.category && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", paddingBottom: "6px", borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: "0.75rem", color: "#94a3b8" }}>
                    <span style={{ fontWeight: "600", color: "#60a5fa" }}>{msg.category}</span>
                    {msg.confidence && (
                      <span>Confidence: {(msg.confidence * 100).toFixed(0)}%</span>
                    )}
                  </div>
                )}
                
                <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>
                  <span>{msg.timestamp}</span>
                  {msg.tokensUsed && <span>{msg.tokensUsed} tokens</span>}
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-muted)", fontSize: "0.85rem", padding: "12px" }}>
              <RefreshCw className="animate-spin" size={18} />
              <span>Small GPT vector reasoning engine evaluating labor matrices...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ marginTop: "20px", display: "flex", gap: "12px", background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: "12px", border: "1px solid var(--border-glass)" }}>
          <input
            type="text"
            placeholder="Ask Small GPT about labor market risks, tech trends, or country briefings..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isGenerating}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none"
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={isGenerating || !inputPrompt.trim()}
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              border: "none",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: isGenerating || !inputPrompt.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600"
            }}
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </div>

      {/* Sidebar - Preset Prompts & Engine Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Presets Panel */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Sparkles size={18} color="#f59e0b" />
            Quick Prompts
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {PRESET_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleSend(prompt.query)}
                disabled={isGenerating}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-glass)",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "10px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-glass)"}
              >
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>{prompt.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{prompt.query}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Engine Specs */}
        <div className="glass-panel" style={{ padding: "24px", flex: 1 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Cpu size={18} color="#3b82f6" />
            Model Specifications
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Engine:</span>
              <span style={{ fontWeight: "600" }}>Nano-GPT Local v2.4</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Latency:</span>
              <span style={{ color: "#10b981", fontWeight: "600" }}>~600ms (Client)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Context Window:</span>
              <span>8,192 Tokens</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Knowledge Scope:</span>
              <span>38 OECD Nations</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Embeddings:</span>
              <span>Normalized 4D Vectors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Key Config Modal */}
      {showConfigModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: "32px", width: "450px", background: "#0f172a", border: "1px solid var(--color-primary)" }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Configure AI Provider</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "20px" }}>
              By default, Small GPT runs offline in your browser. You can optionally connect your OpenAI or Gemini key.
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>Provider</label>
              <select
                value={providerInput}
                onChange={(e) => setProviderInput(e.target.value)}
                style={{ width: "100%", padding: "10px", background: "#1e293b", border: "1px solid var(--border-glass)", color: "#fff", borderRadius: "8px" }}
              >
                <option value="local-small-gpt">Small GPT (Local Offline Engine - Recommended)</option>
                <option value="openai">OpenAI GPT-4o Mini</option>
              </select>
            </div>

            {providerInput === "openai" && (
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>OpenAI API Key</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  style={{ width: "100%", padding: "10px", background: "#1e293b", border: "1px solid var(--border-glass)", color: "#fff", borderRadius: "8px" }}
                />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                style={{ background: "var(--color-primary)", border: "none", color: "#fff", padding: "10px 18px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GptAnalyst;
