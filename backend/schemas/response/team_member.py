from pydantic import BaseModel, UUID4, Field

class TeamMemberResponseSchema(BaseModel):
    team_id: UUID4
    email: str
    role: dict = Field({
        "owner": False,
        "admin": False,
        "member": False
    })
    is_activated: bool
