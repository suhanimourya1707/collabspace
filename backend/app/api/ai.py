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

@router.post("/generate-tasks", response_model=GenerateResponse)
def generate(data: GenerateRequest, current_user: User = Depends(get_current_user)):
    try:
        tasks = generate_tasks(data.prompt)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
    if not tasks:
        raise HTTPException(status_code=502, detail="AI returned no tasks, try a more detailed prompt")
    return {"tasks": tasks}