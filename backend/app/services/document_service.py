from sqlalchemy.orm import Session
from app.models.document import Document
from app.schemas.document import DocumentCreate

def create_document(db: Session, data: DocumentCreate, user_id: int):
    document = Document(
        title=data.title,
        content=data.content,
        workspace_id=data.workspace_id,
        created_by=user_id
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

def get_documents(db: Session, workspace_id: int):
    return db.query(Document).filter(Document.workspace_id == workspace_id).all()

def update_document(db: Session, document_id: int, content: str):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        return None
    document.content = content
    db.commit()
    db.refresh(document)
    return document

def delete_document(db: Session, document_id: int):
    document = db.query(Document).filter(Document.id == document_id).first()
    if document:
        db.delete(document)
        db.commit()
    return document