import uuid
from datetime import datetime
from typing import Optional
from pydantic import UUID4
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.db_handler.team_handler import team_db_handler
from backend.db_handler.team_member_handler import team_member_db_handler
from backend.utils.utils import get_user_detail
from backend.schemas.request.team import TeamSchema
from backend.models.team import Teams


class TeamService():

    @staticmethod
    async def delete_teams(team, db: Session, deleter_id):
        update_data = {
            "is_deleted": True,
            "t_delete": datetime.now(),
            "deleted_by_id": deleter_id
        }
        return team_db_handler.update(db=db, db_obj=team, input_object=update_data)

    @staticmethod
    def get_teams_for_current_user(token: dict, db: Session):

        filters = {
            'email': token["email"],
            'is_deleted': False,
            'is_declined': False
        }

        teams = team_member_db_handler.load_all_by_columns(
            db=db, filters=filters)

        if not teams:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Teams not found"
            )

        # Construct a list of team details for the user
        team_details = [
            {
                "team_id": team_member.team.id,
                "team_name": team_member.team.team_name,
                "is_activated": team_member.is_activated,
                "roles": team_member.roles,
                "invite_token": team_member.invite_token
            }
            for team_member in teams
        ]
        return team_details

    @staticmethod
    def get_team(db: Session, id: Optional[UUID4] = None, name: Optional[str] = None):
        if id:
            team = team_db_handler.load_by_id(db=db, id=id)
            if not team:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Team not found"
                )
            if (name) and (team.team_name == name):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Team name already exists"
                )
            if name:
                team_by_name = team_db_handler.load_by_column(
                    db=db, column_name="team_name", value=name)
                if team_by_name:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Team name already exist"
                    )
            return team

    @staticmethod
    def create_team(decoded_token, request_payload: TeamSchema, db: Session):
        team_data = request_payload.model_dump()
        team_data["created_by_id"] = decoded_token["id"]
        team_data["id"] = uuid.uuid4()
        return team_db_handler.create(db, input_object=team_data)

    @staticmethod
    def update_team(request_payload: TeamSchema, team: Teams, db: Session):
        team_data = request_payload.model_dump()
        return team_db_handler.update(db=db, db_obj=team, input_object=team_data)


team_service = TeamService()
