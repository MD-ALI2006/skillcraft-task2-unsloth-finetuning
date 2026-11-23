from fastapi import APIRouter
from typing import Optional
from backend.app.services.dataset_service import dataset_service

router = APIRouter(prefix="/api/dataset", tags=["Dataset"])

@router.get("/overview")
def get_overview():
    return dataset_service.get_overview()

@router.get("/distribution")
def get_distribution(limit: int = 77):
    return dataset_service.get_class_distribution(limit=limit)

@router.get("/formatted-samples")
def get_formatted_samples():
    return dataset_service.get_formatted_samples()

@router.get("/search")
def search_dataset(
    search: Optional[str] = None,
    intent: Optional[str] = None,
    split: str = "train",
    page: int = 1,
    page_size: int = 20
):
    return dataset_service.search_samples(
        search=search,
        intent=intent,
        split=split,
        page=page,
        page_size=page_size
    )
