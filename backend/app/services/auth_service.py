from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app import schemas
from app.config import get_settings
from app.database.connection import get_db
from app.models import User
from app.utils.security import hash_password, verify_password

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> tuple[str, datetime]:
    expire_delta = timedelta(minutes=expires_minutes or settings.access_token_expires_minutes)
    expire = datetime.utcnow() + expire_delta
    payload = {"sub": subject, "exp": expire}
    encoded = jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
    return encoded, expire


def decode_access_token(token: str) -> str:
    payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    subject: Optional[str] = payload.get("sub")
    if not subject:
        raise JWTError("Token subject missing")
    return subject


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def register_user(db: Session, user_in: schemas.UserCreate) -> User:
    hashed = hash_password(user_in.password)
    user = User(email=user_in.email, password_hash=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        email = decode_access_token(token)
    except JWTError as exc:
        raise credentials_exception from exc

    user = get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user


