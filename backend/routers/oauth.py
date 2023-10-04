from typing import Any
import logging
from authlib.integrations.starlette_client import OAuthError
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import PlainTextResponse
from starlette.requests import Request

from backend.models.database import get_db
from backend.schemas.request.user import (
    UserSchema
)
from backend.schemas.response.user import (
    SignInResponseSchema
)
from backend.service.user import user_service
from .user import check_existing_user
from ..oauth_config import oauth
from backend.utils.utils import generate_random_oauth_password

logger = logging.getLogger(__name__)
oauth_router = APIRouter(prefix="/api/v1/user", tags=["Oauth"])


def oauth_sign_up(request_payload: UserSchema, db) -> Any:
    user = check_existing_user(db=db, column_name='email', value=request_payload.email)
    if not user:
        try:
            user = user_service.create_user(request_payload=request_payload, db=db)
            logger.info("User created successfully: %s", user.email)
        except Exception as e:
            logger.error("Error creating user: %s", str(e))

    access_token = user_service.generate_access_token(user)
    logger.info("Login successful for user: %s", user.email)
    return {"detail": "Login successful", "access_token": access_token}


@oauth_router.get('/oauth-login')
async def oauth_login(request: Request):
    try:
        request.session.clear()
        redirect_uri = request.url_for('auth')
    except Exception as e:
        logger.error("Error generating redirect_uri: %s", str(e))
    return await oauth.google.authorize_redirect(request, redirect_uri)


@oauth_router.get("/auth/google/callback",
                  description="""We receive OAuth access code from the user and change that to access tokens
      from that we get user info to do signup or signin """,
                  status_code=status.HTTP_200_OK,
                  response_model=SignInResponseSchema,
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
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as error:
        logger.error("OAuth error occurred: %s", error)
        # Return a plain text error message
        return PlainTextResponse(f'Error: {error.error}', status_code=400)
    
    if not token:
        logger.warning("OAuth token is not valid or has expired.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="OAuth token is not valid or has expired.",
        )
    
    user = token.get('userinfo')
    if not user:
        logger.warning("User information is not available in the OAuth token.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User information is not available in the OAuth token.",
        )
    
    user_data = {
        "email": user.get("email"),
        "password": generate_random_oauth_password()
    }
    print('user_data ', user_data)
    db = next(get_db())
    request_payload = UserSchema(**user_data)
    return oauth_sign_up(request_payload=request_payload, db=db)
