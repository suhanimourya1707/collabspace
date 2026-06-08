from pydantic import BaseModel
from datetime import datetime
from typing import Optional
class TaskCreate(BaseModel):
  title:str
  description:str
  deadline:datetime
  workspace_id:int
  assigned_to:int
  status:Optional[str]="todo"
class TaskResponse(BaseModel):
  id:int
  title:str
  workspace_id:int
  assigned_to:int
  description:str
  status:Optional[str]="todo"
  deadline:datetime
  class Config:
    from_attributes=True
