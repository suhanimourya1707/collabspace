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
from fastapi.middleware.cors import CORSMiddleware
from app.api.task import router as task_router
from app.websocket.socket import router as websocket_router
from app.api.document import router as document_router
from app.api.invite import router as invite_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_origin_regex=r"https://collabspace-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(workspace_router, prefix="/workspaces", tags=["workspaces"])
app.include_router(task_router, prefix="/tasks", tags=["tasks"])
app.include_router(task_router, prefix="/tasks", tags=["tasks"])
app.include_router(document_router, prefix="/documents", tags=["documents"])
app.include_router(websocket_router, prefix="", tags=["websocket"])
app.include_router(invite_router, tags=["invite"])
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "CollabSpace Backend Running"}