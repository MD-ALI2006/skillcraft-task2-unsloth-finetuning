from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import (
    dataset_routes,
    training_routes,
    evaluation_routes,
    inference_routes,
    export_routes
)

app = FastAPI(
    title="Customer Intent Fine-Tuning API (SkillCraft Internship Task 2)",
    description="PEFT with Unsloth and LoRA on Qwen2.5-1.5B for Banking77 Intent Classification",
    version="1.0.0"
)

# Enable CORS for Vite frontend (typically localhost:5173 or localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dataset_routes.router)
app.include_router(training_routes.router)
app.include_router(evaluation_routes.router)
app.include_router(inference_routes.router)
app.include_router(export_routes.router)

@app.get("/")
def root():
    return {
        "project": "SkillCraft Technology AI Engineering Internship - Task 2",
        "title": "Parameter-Efficient Fine-Tuning of a Small Language Model for Customer Intent Classification Using Unsloth and LoRA",
        "status": "online",
        "endpoints": {
            "dataset": "/api/dataset/overview",
            "distribution": "/api/dataset/distribution",
            "training_state": "/api/training/state",
            "evaluation_metrics": "/api/evaluation/metrics",
            "inference": "/api/inference/predict",
            "export_info": "/api/export/info"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
