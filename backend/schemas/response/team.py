from annotation.backend.schemas.response.subscription import SubscriptionValidationResponseSchema
from pydantic import BaseModel, UUID4, EmailStr
from typing import List


class TeamResponseSchema(BaseModel):
    id: UUID4
    team_name: str
    created_by_id: UUID4


class GetTeamsResponseSchema(BaseModel):
    team_id: UUID4
    team_name: str
    is_activated: bool
    roles: dict
    invite_token: str | None


class GetTeamMembersByTeamId(BaseModel):
    team_member_id: UUID4
    email: EmailStr
    is_activated: bool
    roles: dict
    invite_token: str | None


class GetTeamMembersByTeamIdResponseSchema(BaseModel):
    team: TeamResponseSchema
    team_members: List[GetTeamMembersByTeamId]
    subscription_detail: SubscriptionValidationResponseSchema | None
    is_action: bool
