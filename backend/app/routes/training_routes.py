from fastapi import APIRouter, UploadFile, File
import json
from backend.app.services.evaluation_service import evaluation_service
from backend.app.config import TRAINING_HISTORY_FILE

router = APIRouter(prefix="/api/training", tags=["Training"])

@router.get("/state")
def get_training_state():
    return evaluation_service.get_training_state()

@router.get("/lora-explainer")
def get_lora_explainer():
    return {
        "title": "Parameter-Efficient Fine-Tuning (PEFT) with LoRA and Unsloth",
        "description": "LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters.",
        "parameters": [
            {
                "param": "LoRA Rank (r)",
                "recommended": 16,
                "range": "8 to 64",
                "explanation": "Determines the dimensionality of the low-rank update matrices. A rank of 16 provides an ideal balance of expressive capacity without adding significant parameter overhead."
            },
            {
                "param": "LoRA Alpha (α)",
                "recommended": 16,
                "range": "8 to 32",
                "explanation": "Scaling hyperparameter for the LoRA weight updates. The scaling factor is alpha / r = 1.0, ensuring gradient stability during training."
            },
            {
                "param": "LoRA Dropout",
                "recommended": 0.0,
                "range": "0.0 to 0.1",
                "explanation": "Dropout probability for LoRA layers. In Unsloth, 0.0 is mathematically optimized for faster fused kernel execution."
            },
            {
                "param": "4-bit BitsAndBytes Quantization",
                "recommended": "True",
                "range": "NF4 / FP4",
                "explanation": "Quantizes the 1.5B/3B backbone parameters to 4 bits, reducing model memory footprint to ~1.2 GB, enabling training comfortably on Google Colab T4 (15 GB VRAM)."
            },
            {
                "param": "Gradient Checkpointing",
                "recommended": "unsloth",
                "range": "unsloth / True / False",
                "explanation": "Recomputes activations during the backward pass instead of storing them all in VRAM, saving approximately 30% GPU memory."
            },
            {
                "param": "Learning Rate",
                "recommended": 0.0002,
                "range": "1e-4 to 5e-4",
                "explanation": "LoRA typically requires a higher learning rate (2e-4) compared to full fine-tuning (1e-5 to 2e-5) because only adapter matrices are being trained."
            }
        ]
    }

@router.post("/upload-history")
async def upload_training_history(file: UploadFile = File(...)):
    try:
        content = await file.read()
        parsed = json.loads(content.decode("utf-8"))
        with open(TRAINING_HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(parsed, f, indent=2)
        return {"status": "success", "message": "Uploaded training_history.json successfully. Dashboard updated."}
    except Exception as e:
        return {"status": "error", "message": f"Failed to parse training history JSON: {str(e)}"}
