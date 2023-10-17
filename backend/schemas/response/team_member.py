from backend.schemas.response.user import DetailSchema
from pydantic import BaseModel, UUID4, Field, EmailStr


class TeamMemberResponseSchema(BaseModel):
    team_id: UUID4
    email: EmailStr
    role: dict = Field({
        "owner": False,
        "admin": False,
        "member": False
    })
    is_activated: bool
    is_declined: bool

class AcceptDeclineInvitationSchema(BaseModel):
    detail: DetailSchema
    team_member: TeamMemberResponseSchema


    

