from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.invite_service import generate_invite_code, join_workspace
from app.utils.dependencies import get_current_user
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class JoinRequest(BaseModel):
    code: str

@router.post("/workspaces/{workspace_id}/invite")
def create_invite(workspace_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invite = generate_invite_code(db, workspace_id, current_user.id)
    return {"code": invite.code}

@router.post("/workspaces/join")
def join(data: JoinRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invite = join_workspace(db, data.code, current_user.id)
    if not invite:
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    return {"workspace_id": invite.workspace_id}