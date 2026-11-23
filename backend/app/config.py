import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DATASET_DIR = BASE_DIR / "dataset"
RESULTS_DIR = BASE_DIR / "results"
MODELS_DIR = BASE_DIR / "models"
NOTEBOOKS_DIR = BASE_DIR / "notebooks"

BANKING77_META_FILE = DATASET_DIR / "banking77_meta.json"
CLASS_DISTRIBUTION_FILE = DATASET_DIR / "class_distribution.json"
INTENT_SAMPLES_FILE = DATASET_DIR / "intent_samples.json"
TRAIN_PREVIEW_FILE = DATASET_DIR / "train_preview.json"
TEST_PREVIEW_FILE = DATASET_DIR / "test_preview.json"
FORMATTED_SAMPLES_FILE = DATASET_DIR / "formatted_samples.json"

BENCHMARK_FILE = RESULTS_DIR / "benchmark_reference.json"
TRAINING_HISTORY_FILE = RESULTS_DIR / "training_history.json"
SAMPLE_PREDICTIONS_FILE = RESULTS_DIR / "sample_predictions.json"
