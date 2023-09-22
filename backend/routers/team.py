from typing import Any, List
import logging
from pydantic import UUID4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.request.team import TeamSchema
from backend.schemas.response.team import TeamResponseSchema, DeleteTeamResponseSchema
from backend.models.database import get_db
from backend.service.team import team_service
from backend.db_handler.team_handler import team_db_handler

logger = logging.getLogger(__name__)
team_router = APIRouter(prefix="/api/v1", tags=["Teams"])


def get_team_or_raise_404(db: Session, id: UUID4):
    team = team_db_handler.load_by_id(db=db, id=id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="team not found"
        )
    return team




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


@team_router.patch(
    "/teams/{id}",
    description="This API endpoint allows users to update team",
    response_model=TeamResponseSchema,
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal Server Error"
        }
    }
)
def update_team(
    id: UUID4,
    request_payload: TeamSchema,
    db: Session = Depends(get_db)
):
    team = get_team_or_raise_404(db, id)
    return team_service.update_team(request_payload, team, db)


@team_router.get(
    "/teams/{id}",
    description="Get a team by ID",
    response_model=TeamResponseSchema
)
def get_team_by_id(
    id: UUID4,
    db: Session = Depends(get_db)
):
    return get_team_or_raise_404(db, id)


@team_router.get(
    "/teams",
    description="Get a list of all teams",
    response_model=List[TeamResponseSchema]
)
def get_teams(db: Session = Depends(get_db)):
    team = team_db_handler.load_all(db=db)
    if not team:
        return {"message": "No Teams Found"}
    return team


@team_router.delete(
    "/teams/{id}",
    description="Delete a team by ID",
    response_model=DeleteTeamResponseSchema
)
def delete_team(
    id: UUID4,
    db: Session = Depends(get_db)
):
    _ = get_team_or_raise_404(db, id)
    deleted_team = team_db_handler.delete(db=db, id=id)
    return {
        "detail": "Team deleted successfully",
        "deleted_team": deleted_team
    }