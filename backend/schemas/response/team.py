from pydantic import BaseModel, UUID4


class DeleteTeamResponseSchema(BaseModel):
    id: UUID4
    team_name: str


class TeamResponseSchema(DeleteTeamResponseSchema):
    # id: UUID4
    # team_name: str
    created_by: UUID4
