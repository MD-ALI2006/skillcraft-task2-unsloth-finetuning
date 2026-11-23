import React from "react";
import {
  LayoutDashboard,
  Database,
  Sliders,
  LineChart,
  CheckCircle,
  Play,
  GitCompare,
  DownloadCloud,
  Cpu,
  Layers,
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "dataset", label: "Dataset Explorer", icon: Database },
    { id: "config", label: "LoRA Configuration", icon: Sliders },
    { id: "training", label: "Training Monitor", icon: LineChart },
    { id: "evaluation", label: "Model Evaluation", icon: CheckCircle },
    { id: "playground", label: "Model Playground", icon: Play },
    { id: "comparison", label: "Comparison Board", icon: GitCompare },
    { id: "export", label: "Model Export", icon: DownloadCloud },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #2563eb, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Layers size={20} />
          </div>
          <div className="brand-text">
            <h1 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", lineHeight: "1.2" }}>
              SkillCraft AI
            </h1>
            <span style={{ fontSize: "11px", color: "var(--accent-blue)", fontWeight: "600" }}>
              Task 2: Unsloth PEFT
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 0", flex: 1, overflowY: "auto" }}>
        <div
          style={{
            padding: "0 22px 8px",
            fontSize: "11px",
            fontWeight: "700",
            color: "var(--text-dim)",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}
          className="brand-text"
        >
          Navigation
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span className="nav-text">{item.label}</span>
              </div>
            );
          })}
        </nav>
      </div>

      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--bg-primary)",
        }}
        className="footer-text"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <Cpu size={14} color="#60a5fa" />
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#94a3b8" }}>
            Target: Google Colab T4
          </span>
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
          Qwen2.5-1.5B (4-bit) &middot; LoRA
        </div>
      </div>
    </aside>
  );
}
