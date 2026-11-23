import React, { useState, useEffect } from "react";
import {
  DownloadCloud,
  FileCode,
  HardDrive,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { fetchExportInfo } from "../api";

export default function ExportSection() {
  const [exportInfo, setExportInfo] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetchExportInfo()
      .then(setExportInfo)
      .catch((err) => console.error("Error loading export info:", err));
  }, []);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formats = exportInfo?.export_formats || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Banner */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <DownloadCloud size={18} color="#60a5fa" />
            <span>Model Weights Export & Deployment Center</span>
          </div>
          <span className="badge badge-blue">Production Ready</span>
        </div>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
          Unsloth provides multiple export pathways for fine-tuned LoRA adapters. You can deploy the ultra-compact
          adapter weights (~40 MB) directly onto a base model, merge weights into a standalone 16-bit model, or
          quantize into GGUF for local execution on edge devices.
        </p>
      </div>

      {/* Export Formats Grid */}
      <div className="grid-3">
        {formats.map((fmt, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: idx === 0 ? "linear-gradient(180deg, var(--bg-card), rgba(37, 99, 235, 0.08))" : "var(--bg-card)",
              border: idx === 0 ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid var(--border-card)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc" }}>
                  {fmt.format_name}
                </span>
                {idx === 0 && <span className="badge badge-emerald">Recommended</span>}
              </div>

              <div style={{ fontSize: "12px", color: "#60a5fa", fontWeight: "600", marginBottom: "10px" }}>
                Estimated Size: {fmt.size_estimate}
              </div>

              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px", lineHeight: "1.5" }}>
                {fmt.recommended_for}
              </p>

              <div style={{ fontSize: "11px", color: "var(--text-dim)", marginBottom: "6px", textTransform: "uppercase" }}>
                Output Artifacts:
              </div>
              <ul style={{ listStyle: "none", fontSize: "12px", color: "#cbd5e1", marginBottom: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {fmt.files.map((f, i) => (
                  <li key={i} className="font-mono" style={{ color: "#94a3b8" }}>
                    &bull; {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>
                  Python Export Code:
                </span>
                <button
                  className="btn btn-secondary"
                  style={{ padding: "2px 8px", fontSize: "11px" }}
                  onClick={() => copyToClipboard(fmt.export_code, idx)}
                >
                  {copiedIndex === idx ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                  <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div style={{ background: "#080b12", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-card)" }}>
                <pre className="font-mono" style={{ fontSize: "11px", color: "#34d399", whiteSpace: "pre-wrap" }}>
                  {fmt.export_code}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deployment & Loading Guide */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Terminal size={18} color="#c084fc" />
            <span>Serving & Inference Deployment Snippets</span>
          </div>
        </div>

        <div className="grid-2">
          {/* HuggingFace PEFT */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", marginBottom: "8px" }}>
              Standard Hugging Face Transformers & PEFT
            </div>
            <div style={{ background: "#080b12", padding: "14px", borderRadius: "6px", border: "1px solid var(--border-card)" }}>
              <pre className="font-mono" style={{ fontSize: "12px", color: "#e2e8f0", lineHeight: "1.5" }}>
{`from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

base_model_id = "Qwen/Qwen2.5-1.5B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(base_model_id)
base_model = AutoModelForCausalLM.from_pretrained(base_model_id)

# Load lightweight trained LoRA adapter
model = PeftModel.from_pretrained(base_model, "./lora_adapter")`}
              </pre>
            </div>
          </div>

          {/* Unsloth Fast Inference */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#f8fafc", marginBottom: "8px" }}>
              Unsloth High-Throughput Inference (2x Faster)
            </div>
            <div style={{ background: "#080b12", padding: "14px", borderRadius: "6px", border: "1px solid var(--border-card)" }}>
              <pre className="font-mono" style={{ fontSize: "12px", color: "#e2e8f0", lineHeight: "1.5" }}>
{`from unsloth import FastLanguageModel

# Load merged or adapter model with Triton acceleration
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "./lora_adapter",
    max_seq_length = 256,
    load_in_4bit = True,
)
FastLanguageModel.for_inference(model) # 2x faster!`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Colab Step by Step Instructions */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <BookOpen size={18} color="#34d399" />
            <span>Google Colab Execution & Download Checklist</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#cbd5e1" }}>
          <div style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
            <strong>Step 1: Open Notebook:</strong> Upload <code className="font-mono">notebooks/customer_intent_finetuning_unsloth.ipynb</code> to Google Colab.
          </div>
          <div style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
            <strong>Step 2: Connect T4 GPU:</strong> Runtime &gt; Change runtime type &gt; Hardware accelerator: T4 GPU.
          </div>
          <div style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
            <strong>Step 3: Run All Cells:</strong> Runtime &gt; Run all. Training completes in ~7-8 minutes.
          </div>
          <div style={{ padding: "12px", background: "var(--bg-secondary)", borderRadius: "6px" }}>
            <strong>Step 4: Download Artifacts:</strong> Section 20 will automatically prompt download of <code className="font-mono">skillcraft_intent_model_artifacts.zip</code> containing the LoRA adapter safetensors and step log JSON.
          </div>
        </div>
      </div>
    </div>
  );
}
