from app.database.database import Base, engine
from app.models.user import User
from app.models.workspace import  Workspace
from app.models.task import Task
from app.models.document import Document
from app.models.invite_code import InviteCode
from app.models.workspace_member import WorkspaceMember
from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.workspace import router as workspace_router
app = FastAPI()
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(workspace_router, prefix="/workspaces", tags=["workspaces"])
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "CollabSpace Backend Running"}