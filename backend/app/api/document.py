from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.document import DocumentCreate, DocumentResponse
from app.services.document_service import create_document, get_documents, update_document, delete_document
from app.utils.dependencies import get_current_user
from app.models.user import User
from typing import List
from pydantic import BaseModel

router = APIRouter()

class ContentUpdate(BaseModel):
    content: str

@router.post("/", response_model=DocumentResponse)
def create(data: DocumentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_document(db, data, current_user.id)

@router.get("/{workspace_id}", response_model=List[DocumentResponse])
def get(workspace_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_documents(db, workspace_id)

@router.put("/{document_id}", response_model=DocumentResponse)
def update(document_id: int, data: ContentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = update_document(db, document_id, data.content)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.delete("/{document_id}")
def delete(document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_document(db, document_id)
    return {"message": "Document deleted"}