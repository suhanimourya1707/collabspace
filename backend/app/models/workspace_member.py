from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database.database import Base
from datetime import datetime 

class WorkspaceMember(Base):
    __tablename__ = "workspace_members"

    id = Column(Integer,primary_key=True, index=True)
    user_id=Column(Integer)
    workspace_id=Column(Integer)
    role = Column(String,default="member")
    