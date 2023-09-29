from pydantic import BaseModel, UUID4
from typing import List
from backend.schemas.response.user import DetailSchema


class TeamResponseSchema(BaseModel):
    id: UUID4
    team_name: str
    created_by_id: UUID4


class DeleteTeamResponseSchema(DetailSchema):
    deleted_team: TeamResponseSchema


class GetTeamsResponseSchema(BaseModel):
    team_id: UUID4
    team_name: str
    is_activated: bool
    roles: dict


class GetTeamMembersByTeamId(BaseModel):
    team_member_id: UUID4
    email: str
    is_activated: bool
    roles: dict

class GetTeamMembersByTeamIdResponseSchema(BaseModel):
    team: TeamResponseSchema
    team_members: List[GetTeamMembersByTeamId]