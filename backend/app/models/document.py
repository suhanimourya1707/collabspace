from sqlalchemy import Column, Integer, String, DateTime
from app.database.database import Base
from datetime import datetime 

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer,primary_key=True, index=True)
    title = Column(String,nullable=False)
    content=Column(String)
    created_by=Column(Integer)
    workspace_id=Column(Integer)
    created_at = Column(DateTime,default=datetime.utcnow)
    updated_at=Column(DateTime,default=datetime.utcnow)