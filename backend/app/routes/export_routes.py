from fastapi import APIRouter
from backend.app.config import MODELS_DIR

router = APIRouter(prefix="/api/export", tags=["Export"])

@router.get("/info")
def get_export_info():
    return {
        "export_formats": [
            {
                "format_name": "LoRA Adapter (SafeTensors)",
                "size_estimate": "~40 MB to 75 MB",
                "recommended_for": "Lightweight deployment with vLLM, Hugging Face TGI, or FastLanguageModel",
                "files": ["adapter_model.safetensors", "adapter_config.json", "special_tokens_map.json", "tokenizer.json"],
                "export_code": "model.save_pretrained('lora_adapter')\\ntokenizer.save_pretrained('lora_adapter')",
                "pros": "Zero VRAM bloat, instantly downloadable on Google Colab, highly portable",
                "cons": "Requires base model at inference time"
            },
            {
                "format_name": "16-bit Merged Model",
                "size_estimate": "~3.1 GB (for 1.5B backbone)",
                "recommended_for": "Stand-alone deployment without LoRA runtime overhead",
                "files": ["model.safetensors", "config.json", "tokenizer.json"],
                "export_code": "model.save_pretrained_merged('finetuned_merged_16bit', tokenizer, save_method='merged_16bit')",
                "pros": "No adapter loading needed, directly compatible with any standard HF pipeline",
                "cons": "Larger file size to download from Colab"
            },
            {
                "format_name": "GGUF (Q4_K_M / Q8_0)",
                "size_estimate": "~1.1 GB to 1.8 GB",
                "recommended_for": "Edge deployment via llama.cpp, Ollama, LM Studio, or local CPU/GPU",
                "files": ["qwen2.5-1.5b-banking77-q4_k_m.gguf"],
                "export_code": "model.save_pretrained_gguf('model_gguf', tokenizer, quantization_method='q4_k_m')",
                "pros": "Blazing fast on consumer hardware and local Mac/Windows machines",
                "cons": "Takes 2-3 extra minutes to quantize in Colab"
            }
        ],
        "colab_download_instructions": [
            "In Section 18 of the notebook, model.save_pretrained('./lora_adapter') saves the adapter weights.",
            "In Section 20, shutil.make_archive packages the adapter into skillcraft_intent_model_artifacts.zip.",
            "Colab's files.download() triggers an immediate browser download to your local machine.",
            "Extract the contents into the project's models/ or results/ directory for immediate local usage."
        ]
    }
