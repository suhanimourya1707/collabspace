from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import create_access_token
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def register_user(db: Session, user_data: UserCreate):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        return None
    hashed = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        return None
    token = create_access_token({"sub": user.email})
    return token