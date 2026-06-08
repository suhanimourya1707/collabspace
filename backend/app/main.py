from app.database.database import Base, engine
from app.models.user import User
from app.models.workspace import  Workspace
from app.models.task import Task
from app.models.document import Document
from app.models.invite_code import InviteCode
from app.models.workspace_member import WorkspaceMember

from fastapi import FastAPI

app = FastAPI()
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "CollabSpace Backend Running"}