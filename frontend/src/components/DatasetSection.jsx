import React, { useState, useEffect } from "react";
import {
  Database,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  Code2,
  BarChart3,
} from "lucide-react";
import {
  fetchClassDistribution,
  searchDatasetSamples,
  fetchFormattedSamples,
} from "../api";

export default function DatasetSection({ datasetMeta }) {
  const [distribution, setDistribution] = useState([]);
  const [samplesData, setSamplesData] = useState({ items: [], total: 0, page: 1, total_pages: 1 });
  const [formattedSamples, setFormattedSamples] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntent, setSelectedIntent] = useState("all");
  const [selectedSplit, setSelectedSplit] = useState("train");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);

  useEffect(() => {
    fetchClassDistribution(25)
      .then(setDistribution)
      .catch((err) => console.error("Error loading distribution:", err));

    fetchFormattedSamples()
      .then(setFormattedSamples)
      .catch((err) => console.error("Error loading formatted samples:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    searchDatasetSamples({
      search: searchTerm,
      intent: selectedIntent,
      split: selectedSplit,
      page: currentPage,
      pageSize: 10,
    })
      .then((data) => {
        setSamplesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error searching dataset:", err);
        setLoading(false);
      });
  }, [searchTerm, selectedIntent, selectedSplit, currentPage]);

  const maxCount = distribution.length > 0 ? Math.max(...distribution.map((d) => d.total_count)) : 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Stats Cards */}
      <div className="grid-4">
        <div className="card">
          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Total Samples
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#f8fafc", margin: "6px 0" }}>
            {datasetMeta?.total_samples ? datasetMeta.total_samples.toLocaleString() : "13,083"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
            PolyAI/banking77 on Hugging Face
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Train / Test Ratio
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#60a5fa", margin: "6px 0" }}>
            10,003 / 3,080
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
            76.5% Training &middot; 23.5% Evaluation
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Intent Categories
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#c084fc", margin: "6px 0" }}>
            {datasetMeta?.num_classes || 77} Classes
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
            Uniform multi-class banking domain
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Avg Query Length
          </div>
          <div style={{ fontSize: "26px", fontWeight: "800", color: "#34d399", margin: "6px 0" }}>
            {datasetMeta?.avg_words_per_query || 11.9} Words
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
            Max: {datasetMeta?.max_words_per_query || 79} words
          </div>
        </div>
      </div>

      {/* Class Distribution Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <BarChart3 size={18} color="#60a5fa" />
            <span>Class Distribution (Top 20 Intent Categories)</span>
          </div>
          <span className="badge badge-blue">Empirical Counts</span>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Banking77 was engineered for balanced coverage across customer support inquiries. Below is the exact
          frequency distribution across training and testing splits.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "340px", overflowY: "auto", paddingRight: "8px" }}>
          {distribution.slice(0, 20).map((d) => {
            const pct = Math.round((d.total_count / maxCount) * 100);
            return (
              <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px" }}>
                <span
                  style={{
                    width: "210px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#cbd5e1",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                  title={d.label}
                >
                  {d.label}
                </span>
                <div style={{ flex: 1, background: "var(--bg-secondary)", height: "20px", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #2563eb, #8b5cf6)",
                      borderRadius: "4px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <span style={{ width: "80px", textAlign: "right", color: "var(--text-dim)", fontSize: "12px" }}>
                  {d.total_count} queries
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prompt Formatting Preview Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Code2 size={18} color="#c084fc" />
            <span>Instruction Formatting for Fine-Tuning</span>
          </div>
          <span className="badge badge-purple">Structured Output Schema</span>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
          Unsloth fine-tunes Small Language Models by converting each message into an instruction template paired
          with a ground-truth JSON response. Click samples below to preview prompt formatting:
        </p>

        {formattedSamples.length > 0 && (
          <div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "12px" }}>
              {formattedSamples.slice(0, 5).map((s, idx) => (
                <button
                  key={idx}
                  className={`btn ${selectedSampleIndex === idx ? "btn-primary" : "btn-secondary"}`}
                  style={{ fontSize: "12px", padding: "6px 12px", whiteSpace: "nowrap" }}
                  onClick={() => setSelectedSampleIndex(idx)}
                >
                  Sample #{idx + 1}: {s.intent}
                </button>
              ))}
            </div>

            <div
              style={{
                background: "#080b12",
                border: "1px solid var(--border-card)",
                borderRadius: "8px",
                padding: "16px",
                fontSize: "13px",
                color: "#e2e8f0",
                overflowX: "auto",
              }}
            >
              <pre className="font-mono" style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {formattedSamples[selectedSampleIndex]?.formatted_prompt}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Searchable Dataset Explorer Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Database size={18} color="#60a5fa" />
            <span>Dataset Search & Filter Explorer</span>
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Found {samplesData.total} matching queries
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search customer inquiries (e.g., 'charged twice', 'pin', 'card lost')..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: "36px" }}
            />
            <Search size={16} color="var(--text-dim)" style={{ position: "absolute", left: "12px", top: "12px" }} />
          </div>

          <div>
            <select
              value={selectedIntent}
              onChange={(e) => {
                setSelectedIntent(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Intent Classes (77)</option>
              {datasetMeta?.labels?.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedSplit}
              onChange={(e) => {
                setSelectedSplit(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="train">Training Split (10,003)</option>
              <option value="test">Testing Split (3,080)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Customer Query</th>
                <th style={{ width: "230px" }}>Classified Intent</th>
                <th style={{ width: "80px" }}>Label ID</th>
                <th style={{ width: "90px" }}>Split</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                    Loading dataset samples...
                  </td>
                </tr>
              ) : samplesData.items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                    No matching customer inquiries found. Try another search query.
                  </td>
                </tr>
              ) : (
                samplesData.items.map((row) => (
                  <tr key={row.id}>
                    <td className="font-mono" style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                      {row.id}
                    </td>
                    <td style={{ color: "#f8fafc", fontWeight: "500" }}>"{row.text}"</td>
                    <td>
                      <span className="badge badge-blue font-mono" style={{ textTransform: "none", fontSize: "11px" }}>
                        {row.intent}
                      </span>
                    </td>
                    <td className="font-mono" style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                      {row.label_id}
                    </td>
                    <td>
                      <span className={`badge ${row.split === "train" ? "badge-emerald" : "badge-purple"}`}>
                        {row.split}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-dim)" }}>
            Page {samplesData.page} of {samplesData.total_pages} ({samplesData.total} items)
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn btn-secondary"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{ padding: "6px 12px" }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <button
              className="btn btn-secondary"
              disabled={currentPage >= samplesData.total_pages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{ padding: "6px 12px" }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
