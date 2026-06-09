from pydantic import BaseModel
from datetime import datetime
class WorkspaceCreate(BaseModel):
  name:str
  description:str
class WorkspaceResponse(BaseModel):
  id:int
  name:str
  description:str
  owner_id:int
  created_at:datetime
  class Config:
    from_attributes=True
    