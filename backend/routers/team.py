from typing import List
import logging
from backend.db_handler.team_member_handler import team_member_db_handler
from pydantic import UUID4
import uuid
from fastapi.security import HTTPBearer
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.request.team import TeamSchema
from backend.schemas.response.user import (
    DetailSchema)
from backend.schemas.response.team import (TeamResponseSchema,
                                           GetTeamsResponseSchema,
                                           GetTeamMembersByTeamIdResponseSchema)
from backend.models.database import get_db
from backend.service.team import team_service
from backend.service.team_member import team_member_service
from backend.utils.utils import decode_token

logger = logging.getLogger(__name__)
team_router = APIRouter(prefix="/api/v1", tags=["Teams"])

bearer = HTTPBearer()


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
async def create_team(
    request_payload: TeamSchema,
    authorization: str = Depends(bearer),
    db: Session = Depends(get_db)
):
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    team_service.get_team(
        db, name=request_payload.team_name)

    try:
        created_team = team_service.create_team(
            decoded_token, request_payload=request_payload, db=db)
        # Add the creator as a team member if the team was successfully created
        id = uuid.uuid4()
        team_member_data = team_member_service.add_team_member(id=id,
                                                               team_id=created_team.id,
                                                               email=decoded_token["email"],
                                                               invited_by_id=None,
                                                               invite_token=None,
                                                               role={
                                                                   "owner": True,
                                                                   "admin": True,
                                                                   "member": False},
                                                               is_activated=True)
        team_member_db_handler.create(db=db, input_object=team_member_data)
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
        status.HTTP_403_FORBIDDEN: {
            "description": "Only Owner or Admin can modify the team"
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Team not found"
        },
        status.HTTP_409_CONFLICT: {
            "description": "Team name already exists"
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal Server Error"
        }
    }
)
def update_team(
    id: UUID4,
    request_payload: TeamSchema,
    authorization: str = Depends(bearer),
    db: Session = Depends(get_db)
):
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    filters = {"email": decoded_token["email"],
            "team_id": str(id)}
    _ = team_member_service.role_validation(filters, db)
    team = team_service.get_team(db, id=id, name=request_payload.team_name)
    return team_service.update_team(request_payload, team, db)


@team_router.get(
    "/teams/{id}",
    description="Get a team by ID",
    response_model=GetTeamMembersByTeamIdResponseSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Team not found"
        }
    }
)
def get_team_by_id(
    id: UUID4,
    authorization: str = Depends(bearer),
    db: Session = Depends(get_db)
):
    token = authorization.credentials
    _ = decode_token(token=token)

    team = team_service.get_team(db, id=id)
    team_members_details = team_member_service.get_team_members_detail_with_team_id(
        db, id)
    return {"team": team, "team_members": team_members_details}


@team_router.get(
    "/teams",
    description="Get a list of all the teams of the current user",
    response_model=List[GetTeamsResponseSchema] | DetailSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Teams not found"
        }
    }
)
def get_teams(
    authorization: str = Depends(bearer),
    db: Session = Depends(get_db)
):
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    return team_service.get_teams_for_current_user(decoded_token, db)


@team_router.patch(
    "/teams/{id}/delete",
    description="Delete a team by ID",
    response_model=DetailSchema,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Only Owner or Admin can modify the team"
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Team not found"
        }
    }
)
async def delete_team(
    id: UUID4,
    authorization: str = Depends(bearer),
    db: Session = Depends(get_db)
):
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    # Check if the inviter has 'owner' or 'admin' roles
    decoded_token = decode_token(token=token)
    filters = {"email": decoded_token["email"],
            "team_id": str(id)}
    _ = team_member_service.role_validation(filters, db)
    team = team_service.get_team(db, id=id)
    await team_member_service.delete_team_members(
        db, id, decoded_token["id"])
    deleted_team = await team_service.delete_teams(team=team, db=db, deleter_id=decoded_token["id"])
    # deleted_team = team_db_handler.delete(db=db, id=id)
    return {
        "detail": f"{deleted_team.team_name} team deleted successfully"
    }
