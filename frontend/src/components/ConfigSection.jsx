import React, { useState, useEffect } from "react";
import {
  Sliders,
  Cpu,
  Info,
  CheckCircle,
  HardDrive,
  Gauge,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { fetchLoraExplainer } from "../api";

export default function ConfigSection() {
  const [explainer, setExplainer] = useState(null);

  // Interactive config state
  const [loraRank, setLoraRank] = useState(16);
  const [loraAlpha, setLoraAlpha] = useState(16);
  const [loraDropout, setLoraDropout] = useState(0.0);
  const [learningRate, setLearningRate] = useState("0.0002");
  const [batchSize, setBatchSize] = useState(4);
  const [gradAccum, setGradAccum] = useState(4);
  const [maxSeqLen, setMaxSeqLen] = useState(256);
  const [maxSteps, setMaxSteps] = useState(120);

  useEffect(() => {
    fetchLoraExplainer()
      .then(setExplainer)
      .catch((err) => console.error("Error loading LoRA explainer:", err));
  }, []);

  const effectiveBatchSize = batchSize * gradAccum;
  const scalingFactor = (loraAlpha / loraRank).toFixed(2);

  // Dynamic memory estimation
  const modelBaseVramMB = 1220; // 4-bit 1.5B
  const loraVramMB = Math.round((loraRank / 16) * 74);
  const optimizerVramMB = Math.round((loraRank / 16) * 148);
  const activationVramMB = Math.round((maxSeqLen / 256) * (batchSize / 4) * 2150);
  const overheadVramMB = 1600;
  const totalEstimatedVramMB = modelBaseVramMB + loraVramMB + optimizerVramMB + activationVramMB + overheadVramMB;
  const vramPercent = Math.min(100, Math.round((totalEstimatedVramMB / 15360) * 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Overview Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Sliders size={18} color="#60a5fa" />
            <span>Interactive PEFT & LoRA Hyperparameter Tuning</span>
          </div>
          <span className="badge badge-blue">Google Colab T4 Optimized</span>
        </div>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
          Parameter-Efficient Fine-Tuning freezes the pre-trained 1.54B backbone weights and injects low-rank
          trainable matrices into Transformer projections. Adjust parameters below to simulate hyperparameter
          scaling and inspect real-time VRAM memory calculations for a free Tesla T4 GPU.
        </p>
      </div>

      {/* Main Grid: Controls vs Memory Analysis */}
      <div className="grid-2">
        {/* Controls Column */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", borderBottom: "1px solid var(--border-card)", paddingBottom: "10px" }}>
            Training Hyperparameters
          </div>

          {/* LoRA Rank */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>
                LoRA Rank (r): <span style={{ color: "#60a5fa" }}>{loraRank}</span>
              </label>
              <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>Recommended: 16</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              step="8"
              value={loraRank}
              onChange={(e) => setLoraRank(Number(e.target.value))}
            />
            <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px" }}>
              Determines matrix rank dimension for low-rank updates.
            </div>
          </div>

          {/* LoRA Alpha */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>
                LoRA Alpha (&alpha;): <span style={{ color: "#c084fc" }}>{loraAlpha}</span>
              </label>
              <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                Scaling (&alpha;/r): {scalingFactor}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              step="8"
              value={loraAlpha}
              onChange={(e) => setLoraAlpha(Number(e.target.value))}
            />
            <div style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px" }}>
              Constant scaling factor applied to adapter gradients.
            </div>
          </div>

          {/* Batch Size & Gradient Accumulation */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>
                  Per-Device Batch: {batchSize}
                </label>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="2"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>
                  Grad Accum: {gradAccum}
                </label>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="2"
                value={gradAccum}
                onChange={(e) => setGradAccum(Number(e.target.value))}
              />
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#34d399", background: "var(--bg-secondary)", padding: "8px 12px", borderRadius: "6px" }}>
            Effective Batch Size: <strong>{effectiveBatchSize}</strong> samples per gradient step
          </div>

          {/* Max Sequence Length */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>
                Max Sequence Length: <span style={{ color: "#fbbf24" }}>{maxSeqLen} tokens</span>
              </label>
              <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>Optimal for Banking77</span>
            </div>
            <input
              type="range"
              min="128"
              max="512"
              step="64"
              value={maxSeqLen}
              onChange={(e) => setMaxSeqLen(Number(e.target.value))}
            />
          </div>

          {/* Learning Rate & Max Steps */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
                Learning Rate
              </label>
              <input
                type="text"
                value={learningRate}
                onChange={(e) => setLearningRate(e.target.value)}
                className="font-mono"
              />
            </div>

            <div>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#cbd5e1", display: "block", marginBottom: "6px" }}>
                Optimization Steps ({maxSteps})
              </label>
              <input
                type="range"
                min="60"
                max="240"
                step="20"
                value={maxSteps}
                onChange={(e) => setMaxSteps(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* VRAM Memory Budget Column */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-card)", paddingBottom: "10px" }}>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc" }}>
              Tesla T4 VRAM Budget Calculator
            </div>
            <span className={`badge ${vramPercent < 75 ? "badge-emerald" : "badge-amber"}`}>
              {vramPercent < 75 ? "Optimal & Safe" : "High Memory Pressure"}
            </span>
          </div>

          {/* VRAM Progress Bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Estimated VRAM Utilization</span>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc" }}>
                {totalEstimatedVramMB} MB / 15,360 MB ({vramPercent}%)
              </span>
            </div>
            <div style={{ width: "100%", height: "14px", background: "var(--bg-secondary)", borderRadius: "9999px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${vramPercent}%`,
                  height: "100%",
                  background: vramPercent < 75 ? "linear-gradient(90deg, #10b981, #3b82f6)" : "linear-gradient(90deg, #f59e0b, #ef4444)",
                  borderRadius: "9999px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* VRAM Sub-Component Breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>4-bit Qwen2.5-1.5B Backbone:</span>
              <span className="font-mono" style={{ color: "#f8fafc" }}>{modelBaseVramMB} MB (Fixed)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>LoRA Adapters (r={loraRank}):</span>
              <span className="font-mono" style={{ color: "#60a5fa" }}>{loraVramMB} MB</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>AdamW 8-bit Optimizer States:</span>
              <span className="font-mono" style={{ color: "#c084fc" }}>{optimizerVramMB} MB</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>Activations & Gradient Checkpointing:</span>
              <span className="font-mono" style={{ color: "#34d399" }}>{activationVramMB} MB</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>PyTorch CUDA Runtime Context:</span>
              <span className="font-mono" style={{ color: "#fbbf24" }}>{overheadVramMB} MB</span>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
            <strong>Safety Margin:</strong> ~{(15360 - totalEstimatedVramMB) / 1024 > 0 ? ((15360 - totalEstimatedVramMB) / 1024).toFixed(1) : 0} GB free
            headroom ensures zero out-of-memory (OOM) crashes during long training sequences on Colab.
          </div>
        </div>
      </div>

      {/* Explainer Cards */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Info size={18} color="#60a5fa" />
            <span>Technical Deep Dive: Parameter Breakdown & Quantization</span>
          </div>
        </div>

        <div className="grid-3">
          <div style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#60a5fa", marginBottom: "6px" }}>
              Why 4-bit BitsAndBytes?
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
              Standard float16 weights require 3.1 GB for 1.5B parameters. 4-bit NormalFloat (NF4) reduces model
              size to 1.2 GB with negligible perplexity loss, leaving ample GPU memory for activation caching.
            </div>
          </div>

          <div style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#c084fc", marginBottom: "6px" }}>
              Low-Rank Decomposition (LoRA)
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
              Instead of updating full weight matrix W (d x k), LoRA approximates updates as W + B x A, where B
              is (d x r) and A is (r x k) with r &lt;&lt; d. This slashes trainable parameters from 1.54B to ~18.4M.
            </div>
          </div>

          <div style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#34d399", marginBottom: "6px" }}>
              Unsloth Triton Acceleration
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5" }}>
              Unsloth replaces standard PyTorch linear layers and cross-entropy loss functions with custom Triton
              GPU kernels, eliminating memory round-trips to VRAM and delivering 5x training speedups.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
