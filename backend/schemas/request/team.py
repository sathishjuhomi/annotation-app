from pydantic import BaseModel


class TeamSchema(BaseModel):
    team_name: str
    token: str
