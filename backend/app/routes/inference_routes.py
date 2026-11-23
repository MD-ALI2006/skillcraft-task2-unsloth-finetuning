from fastapi import APIRouter
from backend.app.models.schemas import MessagePredictionRequest, ComparePredictionResponse
from backend.app.services.inference_service import inference_service

router = APIRouter(prefix="/api/inference", tags=["Inference"])

@router.post("/predict", response_model=ComparePredictionResponse)
def predict_intent(request: MessagePredictionRequest):
    return inference_service.predict(message=request.message, model_type=request.model_type)

@router.get("/examples")
def get_examples():
    return inference_service.get_example_prompts()
