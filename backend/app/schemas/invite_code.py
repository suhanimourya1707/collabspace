from pydantic import BaseModel
from datetime import datetime
class InviteCodeCreate(BaseModel):
  code:str
  workspace_id:int
  expires_at:datetime
  is_active:bool
class InviteCodeResponse(BaseModel):
  id:int
  code:str
  workspace_id:int
  created_by:int
  expires_at:datetime 
  is_active:bool
  class Config:
    from_attributes=True