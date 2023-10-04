from typing import Any, Annotated
from pydantic import UUID4
import logging
from backend.db_handler.team_member_handler import team_member_db_handler
from backend.schemas.response.team_member import TeamMemberResponseSchema
from backend.schemas.response.user import DetailSchema


from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session

from backend.utils.utils import get_user_detail
from backend.schemas.request.team_member import TeamMemberSchema
from backend.models.database import get_db
from backend.service.team_member import team_member_service

logger = logging.getLogger(__name__)
team_member_router = APIRouter(prefix="/api/v1", tags=["Team_Members"])


@team_member_router.post("/teams/{team_id}/team_members/invite")
async def invite_team_member(team_id: UUID4,
                             request_payload: TeamMemberSchema,
                             db: Session = Depends(get_db),
                             token: str = Header()) -> dict:
    response = await team_member_service.email_invitation(team_id, token, request_payload=request_payload, db=db)
    return response


@team_member_router.patch("/teams/team-members/accept-invitation",
                        response_model=TeamMemberResponseSchema | DetailSchema)
def accept_invitation(
    db: Session = Depends(get_db),
    token: str = Header(),
) -> dict:
    user, decoded_token = get_user_detail(token=token, db=db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user with this email does not exist",
        )

    team_member_detail = team_member_db_handler.get_by_team_id_and_email(db=db,
                                                                         email=decoded_token['email'],
                                                                         team_id=decoded_token['team_id'])
    response = team_member_service.update_team_member_as_active(token,
                                                                team_member_detail,
                                                                db)

    return response
