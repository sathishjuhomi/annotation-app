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


