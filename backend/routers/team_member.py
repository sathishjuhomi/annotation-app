from typing import Any
import logging


from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from backend.utils.utils import verify_password_reset_token
from backend.schemas.request.team_member import TeamMemberSchema
from backend.models.database import get_db
from backend.service.team_member import team_member_service
from backend.db_handler.user_handler import user_db_handler

logger = logging.getLogger(__name__)
team_member_router = APIRouter(prefix="/api/v1", tags=["Team_Members"])


@team_member_router.post("/invite-team-member")
async def invite_team_member(request_payload: TeamMemberSchema, db: Session = Depends(get_db)):
    response = await team_member_service.email_invitation(request_payload=request_payload, db=db)
    return response


@team_member_router.get("/accept-invitation")
def accept_invitation(
    token: str, db: Session = Depends(get_db)
) -> Any:
    print('inside accept-invitation')
    decoded_token = verify_password_reset_token(token=token)
    user = user_db_handler.load_by_column(
        db=db, column_name="email", value=decoded_token)
    if not user:
        return RedirectResponse(url="/api/v1/user/sign-up")
