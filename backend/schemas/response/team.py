from pydantic import BaseModel, UUID4
from backend.schemas.response.user import DetailSchema


class TeamResponseSchema(BaseModel):
    id: UUID4
    team_name: str
    created_by: UUID4


class DeleteTeamResponseSchema(DetailSchema):
    deleted_team: TeamResponseSchema
