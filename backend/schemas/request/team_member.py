from pydantic import BaseModel, UUID4, Field


class TeamMemberSchema(BaseModel):
    team_id: UUID4
    email: str
    role: dict = Field({
        "owner": False,
        "admin": False,
        "member": False
    })
    token: str
