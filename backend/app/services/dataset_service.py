import json
from typing import Dict, Any, List, Optional
from backend.app.config import (
    BANKING77_META_FILE,
    CLASS_DISTRIBUTION_FILE,
    INTENT_SAMPLES_FILE,
    TRAIN_PREVIEW_FILE,
    TEST_PREVIEW_FILE,
    FORMATTED_SAMPLES_FILE
)

class DatasetService:
    def __init__(self):
        self._meta = None
        self._distribution = None
        self._intent_samples = None
        self._train_samples = None
        self._test_samples = None
        self._formatted_samples = None
        self._load_data()

    def _load_data(self):
        if BANKING77_META_FILE.exists():
            with open(BANKING77_META_FILE, "r", encoding="utf-8") as f:
                self._meta = json.load(f)
        if CLASS_DISTRIBUTION_FILE.exists():
            with open(CLASS_DISTRIBUTION_FILE, "r", encoding="utf-8") as f:
                self._distribution = json.load(f)
        if INTENT_SAMPLES_FILE.exists():
            with open(INTENT_SAMPLES_FILE, "r", encoding="utf-8") as f:
                self._intent_samples = json.load(f)
        if TRAIN_PREVIEW_FILE.exists():
            with open(TRAIN_PREVIEW_FILE, "r", encoding="utf-8") as f:
                self._train_samples = json.load(f)
        if TEST_PREVIEW_FILE.exists():
            with open(TEST_PREVIEW_FILE, "r", encoding="utf-8") as f:
                self._test_samples = json.load(f)
        if FORMATTED_SAMPLES_FILE.exists():
            with open(FORMATTED_SAMPLES_FILE, "r", encoding="utf-8") as f:
                self._formatted_samples = json.load(f)

    def get_overview(self) -> Dict[str, Any]:
        if not self._meta:
            self._load_data()
        return self._meta or {
            "status": "error",
            "message": "Dataset metadata not found. Run dataset/download_and_process.py first."
        }

    def get_class_distribution(self, limit: int = 77) -> List[Dict[str, Any]]:
        if not self._distribution:
            self._load_data()
        return (self._distribution or [])[:limit]

    def get_formatted_samples(self) -> List[Dict[str, Any]]:
        if not self._formatted_samples:
            self._load_data()
        return self._formatted_samples or []

    def search_samples(
        self,
        search: Optional[str] = None,
        intent: Optional[str] = None,
        split: str = "train",
        page: int = 1,
        page_size: int = 20
    ) -> Dict[str, Any]:
        if not self._train_samples or not self._test_samples:
            self._load_data()

        pool = self._train_samples if split == "train" else self._test_samples
        if not pool:
            return {"items": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        results = pool

        if intent and intent.lower() != "all":
            results = [x for x in results if x.get("intent") == intent]

        if search:
            query = search.lower()
            results = [x for x in results if query in x.get("text", "").lower() or query in x.get("intent", "").lower()]

        total = len(results)
        total_pages = max(1, (total + page_size - 1) // page_size)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size

        return {
            "items": results[start_idx:end_idx],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }

dataset_service = DatasetService()
