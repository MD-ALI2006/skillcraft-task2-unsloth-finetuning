import React from "react";
import {
  Layers,
  Database,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileCode2,
  ShieldCheck,
  Server,
} from "lucide-react";

export default function OverviewSection({ setActiveTab, datasetMeta }) {
  const trainCount = datasetMeta?.train_samples || 10003;
  const testCount = datasetMeta?.test_samples || 3080;
  const totalCount = datasetMeta?.total_samples || 13083;
  const classCount = datasetMeta?.num_classes || 77;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Hero Banner */}
      <div
        className="card"
        style={{
          background:
            "linear-gradient(135deg, rgba(20, 27, 45, 0.95), rgba(30, 41, 69, 0.85))",
          borderColor: "rgba(59, 130, 246, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "220px",
            height: "220px",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "880px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
            <span className="badge badge-blue">SkillCraft Technology Internship</span>
            <span className="badge badge-purple">Task 2: AI Engineering</span>
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "800",
              color: "#f8fafc",
              lineHeight: "1.3",
              marginBottom: "12px",
            }}
          >
            Parameter-Efficient Fine-Tuning of a Small Language Model for Customer Intent Classification
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#94a3b8",
              lineHeight: "1.6",
              marginBottom: "20px",
            }}
          >
            Fine-tune open-weight Small Language Models (Qwen2.5-1.5B / Gemma-2B) on real customer support
            inquiries using Unsloth and Low-Rank Adaptation (LoRA). Formulates intent recognition as a
            structured JSON generation task, achieving &gt;90% accuracy while utilizing under 6 GB VRAM on a free
            Google Colab Tesla T4 GPU.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab("playground")}
            >
              <Zap size={16} />
              <span>Open Model Playground</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab("dataset")}
            >
              <Database size={16} />
              <span>Explore Banking77 Data</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab("training")}
            >
              <TrendingUp size={16} />
              <span>View Training Monitor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Total Dataset Queries
            </span>
            <Database size={18} color="#60a5fa" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>
            {totalCount.toLocaleString()}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
            {trainCount.toLocaleString()} train &middot; {testCount.toLocaleString()} test
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Unique Intent Classes
            </span>
            <Layers size={18} color="#c084fc" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>
            {classCount}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
            Fine-grained online banking categories
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Trainable Parameters
            </span>
            <Cpu size={18} color="#34d399" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>
            1.19%
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
            18.4M LoRA params of 1.54B backbone
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Target Hardware
            </span>
            <Server size={18} color="#fbbf24" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>
            Tesla T4
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
            15 GB VRAM &middot; Free Google Colab tier
          </div>
        </div>
      </div>

      {/* Visual Pipeline Architecture */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <TrendingUp size={18} color="#60a5fa" />
            <span>End-to-End Fine-Tuning Pipeline Architecture</span>
          </div>
          <span className="badge badge-blue">Triton-Accelerated</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              padding: "18px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-blue)", marginBottom: "6px" }}>
              STAGE 01
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", marginBottom: "8px" }}>
              Input Query & Formatting
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
              Raw customer message wrapped in an instruction prompt with task definition and schema constraints.
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-purple)", marginBottom: "6px" }}>
              STAGE 02
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", marginBottom: "8px" }}>
              4-bit Backbone (Frozen)
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
              Base Qwen2.5-1.5B quantized to 4-bit via BitsAndBytes. Weights frozen to preserve foundation knowledge.
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-emerald)", marginBottom: "6px" }}>
              STAGE 03
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", marginBottom: "8px" }}>
              LoRA Rank Adapters
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
              Low-rank matrices (r=16, alpha=16) injected into attention projections, trained via Unsloth kernels.
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--accent-amber)", marginBottom: "6px" }}>
              STAGE 04
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc", marginBottom: "8px" }}>
              Deterministic JSON Output
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
              Zero-shot hallucination eliminated. Outputs strict JSON: {`{"intent": "...", "confidence": "high"}`}.
            </div>
          </div>
        </div>
      </div>

      {/* Technical Highlights Grid */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShieldCheck size={18} color="#34d399" />
              <span>Why Unsloth & LoRA?</span>
            </div>
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
            <li style={{ display: "flex", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                <strong>5x Faster Fine-Tuning:</strong> Hand-written Triton kernels bypass PyTorch autograd bottlenecks.
              </span>
            </li>
            <li style={{ display: "flex", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                <strong>70% VRAM Reduction:</strong> Allows training 1.5B-3B models on a 15GB Tesla T4 GPU with room to spare.
              </span>
            </li>
            <li style={{ display: "flex", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                <strong>No Catastrophic Forgetting:</strong> Base model knowledge remains intact while learning the 77 intent labels.
              </span>
            </li>
            <li style={{ display: "flex", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                <strong>Lightweight Artifacts:</strong> The resulting LoRA adapter weighs ~40 MB, enabling instant sharing and deployment.
              </span>
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileCode2 size={18} color="#60a5fa" />
              <span>Internship Task 2 Deliverables</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
              <span>Colab Training Notebook:</span>
              <span className="font-mono" style={{ color: "#60a5fa" }}>customer_intent_finetuning_unsloth.ipynb</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
              <span>Dataset Pipeline:</span>
              <span className="font-mono" style={{ color: "#c084fc" }}>PolyAI/banking77 (13,083 queries)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
              <span>Web Interface:</span>
              <span className="font-mono" style={{ color: "#34d399" }}>React + FastAPI (Modular Architecture)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
              <span>Evaluation Baseline:</span>
              <span className="font-mono" style={{ color: "#fbbf24" }}>Base Zero-Shot vs Fine-Tuned LoRA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
