import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import OverviewSection from "./components/OverviewSection";
import DatasetSection from "./components/DatasetSection";
import ConfigSection from "./components/ConfigSection";
import TrainingSection from "./components/TrainingSection";
import EvaluationSection from "./components/EvaluationSection";
import PlaygroundSection from "./components/PlaygroundSection";
import ComparisonSection from "./components/ComparisonSection";
import ExportSection from "./components/ExportSection";
import { fetchDatasetOverview } from "./api";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [datasetMeta, setDatasetMeta] = useState(null);

  useEffect(() => {
    fetchDatasetOverview()
      .then(setDatasetMeta)
      .catch((err) => console.error("Could not fetch dataset overview:", err));
  }, []);

  const renderActiveSection = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSection setActiveTab={setActiveTab} datasetMeta={datasetMeta} />;
      case "dataset":
        return <DatasetSection datasetMeta={datasetMeta} />;
      case "config":
        return <ConfigSection />;
      case "training":
        return <TrainingSection />;
      case "evaluation":
        return <EvaluationSection />;
      case "playground":
        return <PlaygroundSection />;
      case "comparison":
        return <ComparisonSection />;
      case "export":
        return <ExportSection />;
      default:
        return <OverviewSection setActiveTab={setActiveTab} datasetMeta={datasetMeta} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Header activeTab={activeTab} />
        <main className="content-body">{renderActiveSection()}</main>
      </div>
    </div>
  );
}
