import secrets
from datetime import datetime, timedelta
from typing import Final
from backend.db_handler.user_handler import user_db_handler
from jose import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status

from backend.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
EMAIL_RESET_TOKEN_EXPIRE_HOURS: Final[int] = 1
PASSWORD_REST_TOKEN_EXPIRY: Final[int] = 60
settings = get_settings()
SECRET_KEY: Final[str] = settings.SECRET_KEY


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def generate_salt() -> str:
    return secrets.token_hex(16)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt


def generate_password_reset_token(email: str) -> str:
    access_token_expires = timedelta(minutes=PASSWORD_REST_TOKEN_EXPIRY)
    encoded_jwt = create_access_token(
        data={"email": email}, expires_delta=access_token_expires
    )
    return encoded_jwt


def generate_random_oauth_password(length=20):
    rlength = (length * 3) // 4
    token = secrets.token_urlsafe(rlength)
    translation = str.maketrans('lIO0', 'sxyz')
    return token.translate(translation)


def decode_token(token: str):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError as e:
        raise HTTPException(
            status_code=401, detail=f"JWT verification error: {str(e)}")


def get_user_detail(decoded_token: str, db):
    email = decoded_token["email"]
    user_detail = user_db_handler.load_by_column(
        db=db, column_name='email', value=email)
    return user_detail


def admin_role_validataion(decoded_token: dict, db):
    user = user_db_handler.load_by_column(db=db,
                                          column_name="email",
                                          value=decoded_token["email"])

    if not user.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin have access to certain functionalities and controls."
        )
