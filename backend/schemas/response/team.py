from pydantic import BaseModel, UUID4, EmailStr
from typing import List


class TeamResponseSchema(BaseModel):
    id: UUID4
    team_name: str
    created_by_id: UUID4
    # is_deleted: bool


# class DeleteTeamResponseSchema(DetailSchema):
#     deleted_team: TeamResponseSchema


class GetTeamsResponseSchema(BaseModel):
    team_id: UUID4
    team_name: str
    is_activated: bool
    roles: dict


class GetTeamMembersByTeamId(BaseModel):
    team_member_id: UUID4
    email: EmailStr
    is_activated: bool
    roles: dict


class GetTeamMembersByTeamIdResponseSchema(BaseModel):
    team: TeamResponseSchema
    team_members: List[GetTeamMembersByTeamId]
