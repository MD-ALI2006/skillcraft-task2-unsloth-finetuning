import React from "react";
import { Sparkles, Terminal, BookOpen } from "lucide-react";

export default function Header({ activeTab }) {
  const titles = {
    overview: "Project Overview & Architecture",
    dataset: "Banking77 Dataset Explorer",
    config: "PEFT & LoRA Hyperparameter Configuration",
    training: "Unsloth Training & Loss Monitor",
    evaluation: "Model Evaluation & Benchmark Metrics",
    playground: "Interactive Model Playground",
    comparison: "Base Model vs Fine-Tuned Model Comparison",
    export: "LoRA Adapter & Model Export Center",
  };

  return (
    <header className="top-header">
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#f8fafc" }}>
          {titles[activeTab] || "AI Engineering Dashboard"}
        </h2>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
          SkillCraft Internship Task 2 &middot; Parameter-Efficient Fine-Tuning
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="badge badge-blue">
          <Sparkles size={12} />
          <span>Unsloth QLoRA</span>
        </div>
        <div className="badge badge-purple">
          <Terminal size={12} />
          <span>Qwen2.5-1.5B</span>
        </div>
        <a
          href="#export"
          style={{ textDecoration: "none" }}
          className="badge badge-emerald"
        >
          <BookOpen size={12} />
          <span>Notebook Ready</span>
        </a>
      </div>
    </header>
  );
}
