from pydantic import BaseModel, UUID4


class TeamResponseSchema(BaseModel):
    id: UUID4
    team_name: str
    created_by: UUID4