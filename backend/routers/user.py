from typing import Any
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.db_handler.user_handler import user_db_handler
from backend.models.database import get_db
from backend.schemas.request.user import (
    ResetPasswordSchema,
    UserSchema
)
from backend.schemas.response.user import (
    DetailSchema,
    SignInResponseSchema,
    SignUpResponseSchema
)
from backend.service.user import user_service
from backend.utils.email_utils import send_reset_password_email
from backend.utils.utils import (
    generate_password_reset_token,
    verify_password_reset_token
)

logger = logging.getLogger(__name__)
auth_router = APIRouter(prefix="/api/v1/user", tags=["Authentication"])


def check_existing_user(db, column_name, value):
    try:
        existing_user = user_db_handler.load_by_column(
            db=db, column_name=column_name, value=value)
    except Exception as e:
        logger.error('Error retriving user: %s', e)
    return existing_user


@auth_router.post(
    "/sign-up",
    description="This API endpoint allows users to register and create"
                " an account by providing their registration details, "
                "including email and password.",
    status_code=status.HTTP_201_CREATED,
    response_model=SignUpResponseSchema,
    responses={
        409: {
            "description": "User with this email already exists",
            "content": {
                "application/json": {
                    "example": {"detail": "User with this email already exists"}
                }
            },
        }
    },
)
def sign_up(request_payload: UserSchema, db: Session = Depends(get_db)) -> Any:
    existing_user = check_existing_user(db=db, column_name='email', value=request_payload.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )
    return user_service.create_user(request_payload=request_payload, db=db)


@auth_router.post(
    "/sign-in",
    description="This API endpoint allows users to signin/login an account "
                "by providing their email and password.",
    status_code=status.HTTP_200_OK,
    response_model=SignInResponseSchema,
    responses={
        400: {
            "description": "Incorrect email/password",
            "content": {
                "application/json": {"example": {"detail": "Incorrect email/password"}}
            },
        }
    },
)
def sign_in(request_payload: UserSchema, db: Session = Depends(get_db)) -> Any:
    existing_user = check_existing_user(db=db, column_name='email', value=request_payload.email)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email"
        )
    if existing_user.t_delete:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    valid_password = user_service.validate_password(
        request_payload, existing_user
    )
    if not valid_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password"
        )
    access_token = user_service.generate_access_token(existing_user)
    return {"detail": "Login successful", "access_token": access_token}


@auth_router.post(
    "/password-recovery/{email}",
    description="This API endpoint allows users to ask for password reset via email.",
    status_code=status.HTTP_200_OK,
    response_model=DetailSchema,
    responses={
        404: {
            "description": "The user with this email does not exist in the system.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "The user with this email does not exist in the system."
                    }
                }
            },
        }
    },
)
async def recover_password(email: str, db: Session = Depends(get_db)) -> Any:
    user = user_db_handler.load_by_column(db=db, column_name="email", value=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = generate_password_reset_token(email=email)
    await send_reset_password_email(email_to=user.email, token=password_reset_token)
    return {"detail": "Password recovery email sent"}


@auth_router.post(
    "/reset-password",
    description="This API endpoint allows users to reset their password.",
    status_code=status.HTTP_200_OK,
    response_model=DetailSchema,
    responses={
        400: {
            "description": "Invalid token or Inactive user",
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid token or Inactive user"}
                }
            },
        },
        404: {
            "description": "The user with this email does not exist in the system.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "The user with this email does not exist in the system."
                    }
                }
            },
        },
    },
)
def reset_password(
        token: str, request_payload: ResetPasswordSchema, db: Session = Depends(get_db)
) -> Any:
    email = verify_password_reset_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
        )
    user = user_db_handler.load_by_column(db=db, column_name="email", value=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user with this email does not exist in the system.",
        )
    if user.t_delete:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    user_service.update_password(
        request_payload=request_payload, user=user, db=db
    )
    return {"detail": "Password updated successfully"}
