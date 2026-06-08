from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.database.database import Base
from datetime import datetime 

class InviteCode(Base):
    __tablename__ = "invite_codes"

    id = Column(Integer,primary_key=True, index=True)
    code = Column(String,nullable=False,unique=True)
    created_by=Column(Integer)
    workspace_id=Column(Integer)
    expires_at = Column(DateTime)
    is_active=Column(Boolean,default=True)