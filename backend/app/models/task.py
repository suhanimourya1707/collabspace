from sqlalchemy import Column, Integer, String, DateTime
from app.database.database import Base
from datetime import datetime 

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer,primary_key=True, index=True)
    title = Column(String,nullable=False)
    description=Column(String)
    status=Column(String,default="todo")
    workspace_id=Column(Integer)
    created_at = Column(DateTime,default=datetime.utcnow)
    assigned_to=Column(Integer)
    deadline=Column(DateTime)