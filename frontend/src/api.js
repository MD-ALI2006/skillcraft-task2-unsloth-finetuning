const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchDatasetOverview() {
  const res = await fetch(`${API_BASE}/dataset/overview`);
  if (!res.ok) throw new Error("Failed to load dataset overview");
  return res.json();
}

export async function fetchClassDistribution(limit = 77) {
  const res = await fetch(`${API_BASE}/dataset/distribution?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load class distribution");
  return res.json();
}

export async function searchDatasetSamples(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.intent) query.append("intent", params.intent);
  if (params.split) query.append("split", params.split);
  if (params.page) query.append("page", params.page);
  if (params.pageSize) query.append("page_size", params.pageSize);

  const res = await fetch(`${API_BASE}/dataset/search?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to search dataset");
  return res.json();
}

export async function fetchFormattedSamples() {
  const res = await fetch(`${API_BASE}/dataset/formatted-samples`);
  if (!res.ok) throw new Error("Failed to load formatted samples");
  return res.json();
}

export async function fetchTrainingState() {
  const res = await fetch(`${API_BASE}/training/state`);
  if (!res.ok) throw new Error("Failed to load training state");
  return res.json();
}

export async function fetchLoraExplainer() {
  const res = await fetch(`${API_BASE}/training/lora-explainer`);
  if (!res.ok) throw new Error("Failed to load LoRA explainer");
  return res.json();
}

export async function uploadTrainingHistory(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/training/upload-history`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload training history");
  return res.json();
}

export async function fetchEvaluationMetrics() {
  const res = await fetch(`${API_BASE}/evaluation/metrics`);
  if (!res.ok) throw new Error("Failed to load evaluation metrics");
  return res.json();
}

export async function fetchConfusionMatrix() {
  const res = await fetch(`${API_BASE}/evaluation/confusion-matrix`);
  if (!res.ok) throw new Error("Failed to load confusion matrix");
  return res.json();
}

export async function predictCustomerIntent(message, modelType = "both") {
  const res = await fetch(`${API_BASE}/inference/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, model_type: modelType }),
  });
  if (!res.ok) throw new Error("Failed to obtain prediction");
  return res.json();
}

export async function fetchExamplePrompts() {
  const res = await fetch(`${API_BASE}/inference/examples`);
  if (!res.ok) throw new Error("Failed to load example prompts");
  return res.json();
}

export async function fetchExportInfo() {
  const res = await fetch(`${API_BASE}/export/info`);
  if (!res.ok) throw new Error("Failed to load export information");
  return res.json();
}
