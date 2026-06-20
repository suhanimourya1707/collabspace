from fastapi import APIRouter, Depends, HTTPException
from app.services.ai_service import generate_tasks
from app.utils.dependencies import get_current_user
from app.models.user import User
from pydantic import BaseModel
from typing import List

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str

class GeneratedTask(BaseModel):
    title: str
    description: str

class GenerateResponse(BaseModel):
    tasks: List[GeneratedTask]

@router.get("/debug-env")
def debug_env():
    import os
    key = os.getenv("GROQ_API_KEY")
    matches = [k for k in os.environ.keys() if "groq" in k.lower()]
    return {"key_found": bool(key), "key_length": len(key) if key else 0, "similar_keys": matches}

@router.post("/generate-tasks", response_model=GenerateResponse)
def generate(data: GenerateRequest, current_user: User = Depends(get_current_user)):
    try:
        tasks = generate_tasks(data.prompt)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
    if not tasks:
        raise HTTPException(status_code=502, detail="AI returned no tasks, try a more detailed prompt")
    return {"tasks": tasks}