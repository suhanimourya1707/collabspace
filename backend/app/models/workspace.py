from sqlalchemy import Column, Integer, String, DateTime
from app.database.database import Base
from datetime import datetime 

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(Integer,primary_key=True, index=True)
    name = Column(String,nullable=False)
    description=Column(String)
    owner_id=Column(Integer)
    created_at = Column(DateTime,default=datetime.utcnow)