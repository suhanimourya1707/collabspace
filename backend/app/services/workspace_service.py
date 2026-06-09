from sqlalchemy.orm import Session
from app.models.workspace import Workspace
from app.models.workspace_member import WorkspaceMember
from app.schemas.workspace import WorkspaceCreate

def create_workspace(db: Session, data: WorkspaceCreate, owner_id: int):
    workspace = Workspace(
        name=data.name,
        description=data.description,
        owner_id=owner_id
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    
    member = WorkspaceMember(
        workspace_id=workspace.id,
        user_id=owner_id,
        role="admin"
    )
    db.add(member)
    db.commit()
    
    return workspace

def get_user_workspaces(db: Session, user_id: int):
    return db.query(Workspace).filter(Workspace.owner_id == user_id).all()