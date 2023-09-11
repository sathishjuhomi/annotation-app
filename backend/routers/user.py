from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from backend.db_handler.user_handler import user_db_handler
from backend.models.database import get_db
from backend.schemas.request.user import (
    ResetPasswordSchema,
    UserSchema,
    OauthUserSchema
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

from starlette.requests import Request
from authlib.integrations.starlette_client import OAuthError
from .oauth_config import oauth

auth_router = APIRouter(prefix="/api/v1/user", tags=["Authentication"])

def check_existing_user(db, column_name, value):
  existing_user = user_db_handler.load_by_column(
        db=db, column_name=column_name, value=value)
  return existing_user

@auth_router.post(
    "/oauth_sign-up",
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
def oauth_sign_up(request_payload: OauthUserSchema, db: Session = Depends(get_db)) -> Any:
    print('db ', db)
    user = check_existing_user(db=db, column_name='email', value=request_payload['email'])

    if not user:
      user = user_service.create_user(request_payload=request_payload, db=db)

    access_token = user_service.generate_access_token(user)
    return {"message": "Login successful", "access_token": access_token}

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
    print('db ', db)
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

######################Google OAuth###################### 

@auth_router.get('/oauth_login')
async def oauth_login(request: Request):
    redirect_uri = request.url_for('auth')
    print('redirect_uri', redirect_uri)
    return await oauth.google.authorize_redirect(request, redirect_uri)

@auth_router.get("/auth/google/callback",
    description="""We receive OAuth access code from the user and change that to access tokens
      from that we get user info to do signup or signin """,
    status_code=status.HTTP_200_OK,
    response_model=DetailSchema,
    responses={
        401: {
            "description": "Invalid token or user info does not exist",
            "content": {
                "application/json": {
                    "example": {"detail": "Invalid token or User info does not exist in the token"}
                }
            },
        }
    }
)
async def auth(request: Request):
    print('Inside auth')
    print('request ', request)
    # try:
    token = await oauth.google.authorize_access_token(request)
    print('token ', token)
    # except OAuthError as error:
    #     # Return a plain text error message
    #     return PlainTextResponse(f'Error: {error.error}', status_code=400)
    print('token ', token)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="OAuth token is not valid or has expired.",
        )
    
    user = token.get('userinfo')
    print('user ', user )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User information is not available in the OAuth token.",
        )    

    user_data = {
        "email": user.get("email")
    }
    print('user_data', user_data)
    Session=Depends(get_db)
    print('Session ', Session)    
    return oauth_sign_up(request_payload=user_data, db=Session)