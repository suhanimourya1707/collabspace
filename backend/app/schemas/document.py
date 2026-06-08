from pydantic import BaseModel
from datetime import datetime
class DocumentCreate(BaseModel):
  title:str
  workspace_id:int
  content:str
class DocumentResponse(BaseModel):
  id:int
  title:str
  content:str
  workspace_id:int
  created_by:int
  updated_at:datetime
  created_at:datetime
  class Config:
    from_attributes=True
