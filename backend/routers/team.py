from typing import Any, List, Optional
import logging
from pydantic import UUID4
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.request.team import TeamSchema
from backend.schemas.response.user import (
    DetailSchema)
from backend.schemas.response.team import TeamResponseSchema, DeleteTeamResponseSchema
from backend.models.database import get_db
from backend.service.team import team_service
from backend.db_handler.team_handler import team_db_handler
from backend.service.team_member import team_member_service

logger = logging.getLogger(__name__)
team_router = APIRouter(prefix="/api/v1", tags=["Teams"])


def get_team_or_raise_404(db: Session, id: Optional[UUID4] = None, name: Optional[str] = None):
    if id is not None:
        team = team_db_handler.load_by_id(db=db, id=id)
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="team not found"
            )
        return team
    if name is not None:
        team = team_db_handler.load_by_column(
            db=db, column_name="team_name", value=name)
        if team:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Team name already exist"
            )
        return team


@team_router.post(
    "/teams",
    description="This API endpoint allows users to create Team",
    status_code=status.HTTP_201_CREATED,
    response_model=TeamResponseSchema | DetailSchema,
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
    team = get_team_or_raise_404(db, name=request_payload.team_name)
    if not team:
        try:
            created_team, creator_email = team_service.create_team(
                request_payload=request_payload, db=db)
            # Add the creator as a team member if the team was successfully created
            _ = team_member_service.add_team_creator_as_team_member(
                created_team, creator_email, db)

            return created_team
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
    team = get_team_or_raise_404(db, id=id)
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
    return get_team_or_raise_404(db, id=id)


@team_router.get(
    "/teams",
    description="Get a list of all teams",
    response_model=List[TeamResponseSchema] | DetailSchema
)
def get_teams(db: Session = Depends(get_db)):
    team = team_db_handler.load_all(db=db)
    if not team:
        return {"detail": "No Teams Found"}
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
    _ = get_team_or_raise_404(db, id=id)
    deleted_team = team_db_handler.delete(db=db, id=id)
    return {
        "detail": "Team deleted successfully",
        "deleted_team": deleted_team
    }
