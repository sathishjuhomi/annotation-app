from typing import Any
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.request.team import TeamSchema
from backend.schemas.response.team import TeamResponseSchema
from backend.models.database import get_db
from backend.service.team import team_service

logger = logging.getLogger(__name__)
team_router = APIRouter(prefix="/api/v1", tags=["Teams"])


@team_router.post(
    "/teams",
    description="This API endpoint allows users to create Team",
    status_code=status.HTTP_201_CREATED,
    response_model=TeamResponseSchema,
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal Server Error"
        }
    }
)
def create_team(
    request_payload: TeamSchema,
    db: Session = Depends(get_db)
):
    try:
        return team_service.create_team(request_payload, db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
