from typing import Any, List
import logging
from pydantic import UUID4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from backend.utils.utils import create_access_token, verify_password_reset_token
from backend.schemas.request.team_member import TeamMemberSchema
from backend.utils.email_team_member import send_invitation_email
from backend.schemas.response.team import TeamResponseSchema, DeleteTeamResponseSchema
from backend.models.database import get_db
from backend.service.team import team_service
from backend.db_handler.team_member_handler import team_member_db_handler
from backend.db_handler.user_handler import user_db_handler
logger = logging.getLogger(__name__)
team_member_router = APIRouter(prefix="/api/v1", tags=["Team_Members"]) #


@team_member_router.post("/invite-token")
async def generate_invite_token(request_payload:TeamMemberSchema):
    print('request_payload ', request_payload)
    member_detail = request_payload.model_dump()
    print('Member_detail', member_detail)
    member_detail['team_id'] = str(member_detail['team_id'])
    token = create_access_token(member_detail)
    email = request_payload.email
    await send_invitation_email(email_to=email, token=token)
    return {"detail": f"{email} invited successfully"}


@team_member_router.get("/accept-invitation")
def accept_invitation(
    token: str, db: Session = Depends(get_db)
    ) -> Any:
    print('inside accept-invitation')
    decoded_token = verify_password_reset_token(token=token)
    user = user_db_handler.load_by_column(db=db, column_name="email", value=decoded_token)
    if not user:
        return RedirectResponse(url="/api/v1/user/sign-up")