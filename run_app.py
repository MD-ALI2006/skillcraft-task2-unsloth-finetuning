"""
SkillCraft Technology - Task 2 Application Launcher
Runs the FastAPI Backend on http://127.0.0.1:8000
"""

import subprocess
import sys
import os
import uvicorn

def main():
    print("=" * 70)
    print("SkillCraft Technology AI Engineering Internship - Task 2")
    print("Parameter-Efficient Fine-Tuning with Unsloth & LoRA")
    print("=" * 70)
    print("Starting FastAPI Backend at: http://127.0.0.1:8000")
    print("API Documentation available at: http://127.0.0.1:8000/docs")
    print("-" * 70)
    print("To launch the React Frontend in parallel, run in a separate terminal:")
    print("  cd frontend")
    print("  npm run dev")
    print("=" * 70)
    
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()
