from annotation.backend.schemas.response.user import DetailSchema
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


class AcceptInvitationSchema(BaseModel):
    detail: DetailSchema
    team_member: TeamMemberResponseSchema


class MemberDetailSchema(BaseModel):
    team_name: str
    invited_by: EmailStr
    invite_token: str
