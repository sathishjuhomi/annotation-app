from pydantic import BaseModel, UUID4


class TeamMemberSchema(BaseModel):
    team_id: UUID4
    email: str
    role: str
    token: str
