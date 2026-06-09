from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse
from app.services.workspace_service import create_workspace, get_user_workspaces
from app.utils.dependencies import get_current_user
from app.models.user import User
from typing import List

router = APIRouter()

@router.post("/", response_model=WorkspaceResponse)
def create(data: WorkspaceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_workspace(db, data, current_user.id)

@router.get("/", response_model=List[WorkspaceResponse])
def get_workspaces(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_workspaces(db, current_user.id)