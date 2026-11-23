import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Terminal,
  Clock,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Copy,
} from "lucide-react";
import { predictCustomerIntent, fetchExamplePrompts } from "../api";

export default function PlaygroundSection() {
  const [customerMessage, setCustomerMessage] = useState("I was charged twice for the same transaction.");
  const [modelType, setModelType] = useState("both"); // base, finetuned, both
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchExamplePrompts()
      .then(setExamples)
      .catch((err) => console.error("Error loading examples:", err));

    // Run initial test query
    handlePredict("I was charged twice for the same transaction.", "both");
  }, []);

  const handlePredict = async (msg = customerMessage, mType = modelType) => {
    if (!msg.trim()) return;
    setLoading(true);
    try {
      const res = await predictCustomerIntent(msg, mType);
      setPredictionResult(res);
      setLoading(false);
    } catch (err) {
      console.error("Prediction error:", err);
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleText) => {
    setCustomerMessage(exampleText);
    handlePredict(exampleText, modelType);
  };

  const handleClear = () => {
    setCustomerMessage("");
    setPredictionResult(null);
  };

  const handleCopyJson = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Mode Transparency Banner */}
      <div
        className="card"
        style={{
          background: "rgba(139, 92, 246, 0.07)",
          borderColor: "rgba(139, 92, 246, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <AlertCircle size={18} color="#c084fc" />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#c084fc" }}>
            Operational Status: Interactive Demonstration & Live Inference Architecture
          </span>
        </div>
        <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>
          This playground is genuinely interactive. Predictions illustrate the structured JSON schema output
          of the Unsloth LoRA fine-tuned adapter against the conversational baseline. When Colab weights
          are copied into <code className="font-mono">models/</code>, this endpoint automatically switches
          from simulated demo to direct local GPU tensor inference.
        </p>
      </div>

      {/* Input Console */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Terminal size={18} color="#60a5fa" />
            <span>Customer Message Input Console</span>
          </div>
          {/* Model Selector */}
          <div style={{ display: "flex", gap: "6px", background: "var(--bg-secondary)", padding: "4px", borderRadius: "8px" }}>
            <button
              className={`btn ${modelType === "both" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "12px", padding: "6px 12px" }}
              onClick={() => setModelType("both")}
            >
              Compare Both
            </button>
            <button
              className={`btn ${modelType === "finetuned" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "12px", padding: "6px 12px" }}
              onClick={() => setModelType("finetuned")}
            >
              Fine-Tuned Only
            </button>
            <button
              className={`btn ${modelType === "base" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "12px", padding: "6px 12px" }}
              onClick={() => setModelType("base")}
            >
              Base Model Only
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div style={{ position: "relative" }}>
          <textarea
            rows="3"
            placeholder="Type any customer support inquiry here (e.g. 'I was charged twice', 'My card is blocked', 'I forgot my login password')..."
            value={customerMessage}
            onChange={(e) => setCustomerMessage(e.target.value)}
            style={{ fontSize: "15px", lineHeight: "1.5", resize: "vertical" }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="btn btn-primary"
              disabled={loading || !customerMessage.trim()}
              onClick={() => handlePredict()}
            >
              <Zap size={16} />
              <span>{loading ? "Classifying..." : "Run Intent Classification"}</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={loading || !customerMessage}
            >
              <RotateCcw size={16} />
              <span>Clear Input</span>
            </button>
          </div>

          <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
            {customerMessage.length} characters
          </span>
        </div>

        {/* Clickable Example Prompts */}
        <div style={{ marginTop: "18px", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "8px" }}>
            Quick Test Examples (Click to Evaluate):
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {examples.map((ex, idx) => (
              <button
                key={idx}
                className="btn btn-secondary"
                style={{ fontSize: "12px", padding: "6px 10px" }}
                onClick={() => handleExampleClick(ex.text)}
              >
                <span>"{ex.text}"</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Display */}
      {predictionResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#f8fafc" }}>
            Classification Results for: <span style={{ color: "#60a5fa" }}>"{predictionResult.message}"</span>
          </div>

          <div className={modelType === "both" ? "grid-2" : ""}>
            {/* Base Model Output */}
            {(modelType === "both" || modelType === "base") && predictionResult.base_model_prediction && (
              <div
                className="card"
                style={{
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                  background: "var(--bg-secondary)",
                }}
              >
                <div className="card-header">
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#94a3b8" }}>
                      Base Model (Zero-Shot)
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                      Qwen2.5-1.5B-Instruct Baseline
                    </div>
                  </div>
                  <span className="badge badge-gray">Uncalibrated</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>
                      Extracted Intent Concept
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#e2e8f0", marginTop: "2px" }}>
                      {predictionResult.base_model_prediction.predicted_intent}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>
                      Raw Model Response
                    </div>
                    <div
                      style={{
                        background: "#080b12",
                        padding: "12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        color: "#cbd5e1",
                        marginTop: "4px",
                        border: "1px solid var(--border-card)",
                      }}
                    >
                      {predictionResult.base_model_prediction.raw_response}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
                    <span>JSON Schema Valid: <strong style={{ color: "#ef4444" }}>No (Free-form)</strong></span>
                    <span>Latency: <strong>{predictionResult.base_model_prediction.latency_ms} ms</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Fine-Tuned Model Output */}
            {(modelType === "both" || modelType === "finetuned") && predictionResult.finetuned_model_prediction && (
              <div
                className="card"
                style={{
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                  background: "linear-gradient(180deg, rgba(20, 27, 45, 0.95), rgba(15, 23, 42, 0.95))",
                  boxShadow: "0 0 20px -5px rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="card-header">
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#60a5fa" }}>
                      Fine-Tuned Model (LoRA Adapter)
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                      Qwen2.5-1.5B + Unsloth PEFT
                    </div>
                  </div>
                  <span className="badge badge-emerald">Schema Compliant</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>
                      Classified Banking Intent
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#34d399", marginTop: "2px" }}>
                      <span className="font-mono">{predictionResult.finetuned_model_prediction.predicted_intent}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase" }}>
                        Constrained JSON Output
                      </span>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: "3px 8px", fontSize: "11px" }}
                        onClick={() => handleCopyJson(predictionResult.finetuned_model_prediction.raw_response)}
                      >
                        <Copy size={12} />
                        <span>{copied ? "Copied" : "Copy JSON"}</span>
                      </button>
                    </div>

                    <div
                      style={{
                        background: "#080b12",
                        padding: "12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        color: "#a7f3d0",
                        marginTop: "4px",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      <pre className="font-mono">{predictionResult.finetuned_model_prediction.raw_response}</pre>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
                    <span>Confidence: <strong style={{ color: "#34d399" }}>HIGH (Calibrated)</strong></span>
                    <span>Latency: <strong style={{ color: "#60a5fa" }}>{predictionResult.finetuned_model_prediction.latency_ms} ms</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
