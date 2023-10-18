from typing import Any
from backend.db_handler.team_member_handler import team_member_db_handler
from backend.db_handler.user_handler import user_db_handler
from pydantic import UUID4
import logging

from backend.schemas.response.team_member import AcceptInvitationSchema, MemberDetailSchema
from backend.schemas.response.user import DetailSchema

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from backend.utils.utils import decode_token
from backend.schemas.request.team_member import TeamMemberSchema
from backend.models.database import get_db
from backend.service.team_member import team_member_service

logger = logging.getLogger(__name__)
team_member_router = APIRouter(prefix="/api/v1", tags=["Team_Members"])

bearer = HTTPBearer()

@team_member_router.post("/teams/{team_id}/team-members/invite")
async def invite_team_member(team_id: UUID4,
                             request_payload: TeamMemberSchema,
                             db: Session = Depends(get_db),
                             authorization: str = Depends(bearer)) -> Any:
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    response = await team_member_service.email_invitation(team_id, decoded_token, request_payload=request_payload, db=db)
    return response


@team_member_router.get("/teams/team-members/member-detail",
                         response_model=MemberDetailSchema | DetailSchema)
def get_team_member_detail(
    invite_token: str,
    db: Session = Depends(get_db),
    authorization: str = Depends(bearer),
) -> dict:
    token = authorization.credentials
    _ = decode_token(token=token)
    _ = decode_token(token=invite_token)
    team_member_detail = team_member_db_handler.load_by_column(db=db,
                                                               column_name="invite_token",
                                                               value=invite_token)
    if not team_member_detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid Invite Token",
        )

    invited_by_id = team_member_detail.team.created_by_id
    user = user_db_handler.load_by_column(
        db=db, column_name='id', value=invited_by_id)
    response = {"team_name": team_member_detail.team.team_name,
                "invited_by": user.email,
                "invite_token": invite_token}
    return response


@team_member_router.patch("/teams/team-members/accept-invitation",
                          response_model=AcceptInvitationSchema | DetailSchema)
async def accept_invitation(
    invite_token: str,
    db: Session = Depends(get_db),
    authorization: str = Depends(bearer),
) -> dict:
    token = authorization.credentials
    _ = decode_token(token=token)
    decoded_token = decode_token(token=invite_token)
    user = user_db_handler.load_by_column(
        db=db, column_name='email', value=decoded_token["email"])

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user with this email does not exist",
        )

    team_member_detail = team_member_db_handler.load_by_column(db=db,
                                                               column_name="id",
                                                               value=decoded_token["id"])
    activate = {"is_activated": True}

    response = team_member_db_handler.update(db=db,
                                             db_obj=team_member_detail,
                                             input_object=activate)
    return {"detail": f"{response.team.team_name} team invitation accepted", "team_member": response}


@team_member_router.patch("/teams/team-members/decline-invitation",
                          response_model=DetailSchema)
def decline_invitation(
    invite_token: str,
    db: Session = Depends(get_db),
    authorization: str = Depends(bearer),
) -> dict:
    token = authorization.credentials
    _ = decode_token(token=token)
    decoded_token = decode_token(token=invite_token)
    team_member_detail = team_member_db_handler.load_by_column(db=db,
                                                               column_name="id",
                                                               value=decoded_token["id"])
    print('team_member_detail ', team_member_detail)
    decline = {"is_declined": True}

    team_member_db_handler.update(db=db,
                                  db_obj=team_member_detail,
                                  input_object=decline)
    return {"detail": f"{team_member_detail.team.team_name} team invitation declined"}


@team_member_router.patch("/teams/team-members/{id}/delete",
                          response_model=DetailSchema)
def delete_team_member(
    id: UUID4,
    db: Session = Depends(get_db),
    authorization: str = Depends(bearer),
) -> Any:
    """
    validate the token
    check the current user role, owner or admin
    If owner or admin, get the team member with member id from team member table
    or raise exception
    create a dict with key is_deleted and value True,
        key deleted_by_id and value current user id
    call the update method
    """
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    return team_member_service.delete_member(decoded_token, id, db=db)
