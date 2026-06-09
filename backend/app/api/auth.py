from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import register_user, login_user
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, user_data)
    if not user:
        raise HTTPException(status_code=400, detail="Email already exists")
    return user

@router.post("/login")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    token = login_user(db, login_data.email, login_data.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token, "token_type": "bearer"}