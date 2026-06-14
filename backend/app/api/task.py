from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.task import TaskCreate, TaskResponse
from app.services.task_service import create_task, get_tasks, update_task, delete_task
from app.utils.dependencies import get_current_user
from app.models.user import User
from typing import List
from pydantic import BaseModel

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

@router.post("/", response_model=TaskResponse)
def create(data: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_task(db, data)

@router.get("/{workspace_id}", response_model=List[TaskResponse])
def get(workspace_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_tasks(db, workspace_id)

@router.put("/{task_id}", response_model=TaskResponse)
def update(task_id: int, data: StatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = update_task(db, task_id, data.status)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/{task_id}")
def delete(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_task(db, task_id)
    return {"message": "Task deleted"}