from fastapi import APIRouter
from backend.app.services.evaluation_service import evaluation_service

router = APIRouter(prefix="/api/evaluation", tags=["Evaluation"])

@router.get("/metrics")
def get_metrics():
    return evaluation_service.get_comparison_metrics()

@router.get("/confusion-matrix")
def get_confusion_matrix():
    return evaluation_service.get_confusion_matrix_data()
