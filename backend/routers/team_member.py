from typing import Any
import logging
from backend.db_handler.team_member_handler import team_member_db_handler
from backend.schemas.response.team_member import TeamMemberResponseSchema


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.utils.utils import get_user_detail
from backend.schemas.request.team_member import TeamMemberSchema
from backend.models.database import get_db
from backend.service.team_member import team_member_service

logger = logging.getLogger(__name__)
team_member_router = APIRouter(prefix="/api/v1", tags=["Team_Members"])


@team_member_router.post("/invite-team-member")
async def invite_team_member(request_payload: TeamMemberSchema, db: Session = Depends(get_db)):
    response = await team_member_service.email_invitation(request_payload=request_payload, db=db)
    return response


@team_member_router.get("/accept-invitation",
                        response_model=TeamMemberResponseSchema)
def accept_invitation(
    token: str,
    db: Session = Depends(get_db)
) -> Any:
    user, decoded_token = get_user_detail(token=token, db=db)

    if not user:
        raise Exception("User not exist")

    team_member_detail = team_member_db_handler.get_by_team_id_and_email(db=db,
                                                                         email=decoded_token['email'],
                                                                         team_id=decoded_token['team_id'])
    response = team_member_service.update_team_member_as_active(token,
                                                                team_member_detail,
                                                                db)

    return response
