from pydantic import BaseModel, UUID4


class TeamSchema(BaseModel):
    team_name: str
    token: str


