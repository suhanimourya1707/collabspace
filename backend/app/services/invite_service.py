import secrets
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.invite_code import InviteCode
from app.models.workspace_member import WorkspaceMember

def generate_invite_code(db: Session, workspace_id: int, user_id: int):
    db.query(InviteCode).filter(InviteCode.workspace_id == workspace_id).delete()
    
    code = secrets.token_hex(4).upper()
    invite = InviteCode(
        code=code,
        workspace_id=workspace_id,
        created_by=user_id,
        expires_at=datetime.utcnow() + timedelta(days=7),
        is_active=True
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)
    return invite

def join_workspace(db: Session, code: str, user_id: int):
    invite = db.query(InviteCode).filter(InviteCode.code == code, InviteCode.is_active == True).first()
    if not invite:
        return None
    if invite.expires_at < datetime.utcnow():
        return None
    
    existing = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == invite.workspace_id,
        WorkspaceMember.user_id == user_id
    ).first()
    if existing:
        return invite
    
    member = WorkspaceMember(workspace_id=invite.workspace_id, user_id=user_id, role="member")
    db.add(member)
    db.commit()
    return invite
    