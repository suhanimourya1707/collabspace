from sqlalchemy.orm import Session
from app.models.task import Task
from app.schemas.task import TaskCreate

def create_task(db: Session, data: TaskCreate):
    task = Task(
        title=data.title,
        description=data.description,
        status=data.status,
        deadline=data.deadline,
        workspace_id=data.workspace_id,
        assigned_to=data.assigned_to
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks(db: Session, workspace_id: int):
    return db.query(Task).filter(Task.workspace_id == workspace_id).all()

def update_task(db: Session, task_id: int, status: str):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None
    task.status = status
    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        db.delete(task)
        db.commit()
    return task