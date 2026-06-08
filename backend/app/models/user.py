from sqlalchemy import Column, Integer, String, DateTime
from app.database.database import Base
from datetime import datetime 

class User(Base):
    __tablename__ = "users"

    id = Column(Integer,primary_key=True, index=True)
    username = Column(String,nullable=False)
    email = Column(String,nullable=False)
    password = Column(String)
    created_at = Column(DateTime,default=datetime.utcnow)