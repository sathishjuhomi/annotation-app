from typing import List
import logging
from backend.models.database import get_db
from backend.schemas.request.project import ProjectRequestSchema
from backend.schemas.response.project import ProjectResponseSchema
from backend.schemas.response.user import DetailSchema
from backend.service.project import project_service
from backend.utils.utils import decode_token
from pydantic import UUID4
import uuid
from fastapi.security import HTTPBearer
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)
project_router = APIRouter(prefix="/api/v1", tags=["Projects"])

bearer = HTTPBearer()


@project_router.post(
    "/teams/{team_id}/projects",
    description="This API endpoint allows owner or admin to create Project",
    status_code=status.HTTP_201_CREATED,
    response_model=ProjectResponseSchema|DetailSchema,
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal Server Error"
        }
    }
)
def create_project(
        request_payload: ProjectRequestSchema,
        team_id: UUID4,
        authorization: str = Depends(bearer),
        db: Session = Depends(get_db)
):
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    response = project_service.create_project(decoded_token,
                                              request_payload,
                                              team_id,
                                              db)
    return response
