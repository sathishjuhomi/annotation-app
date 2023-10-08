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
    def preprocess_team_data(decoded_token, request_payload, db):
        team = request_payload.model_dump()
        creater_detail = get_user_detail(decoded_token, db)
        team["created_by_id"] = creater_detail.id
        team["creator_email"] = creater_detail.email
        return team

    @staticmethod
    async def delete_teams(team, db: Session, deleter_id):
        update_data = {
            "is_deleted": True,
            "t_delete": datetime.now(),
            "deleted_by_id": deleter_id
        }
        return team_db_handler.update(db=db, db_obj=team, input_object=update_data)

    @staticmethod
    def get_teams_for_current_user(token: str, db: Session):
        # Load teams based on the user's email
        teams = team_member_db_handler.load_all_by_column(
            db=db, column_name='email', value=token["email"])

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
            }
            for team_member in teams
            if (team_member.is_deleted == False) and
            (team_member.is_declined == False)
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
            if name and team.team_name == name:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Team name already exists"
                )
            return team
        if name:
            team = team_db_handler.load_by_column(
                db=db, column_name="team_name", value=name)
            if team:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Team name already exist"
                )
        return None

    def create_team(self, decoded_token, request_payload: TeamSchema, db: Session):
        team_data = self.preprocess_team_data(
            decoded_token, request_payload, db)
        team_data["id"] = uuid.uuid4()
        creator_email = team_data["creator_email"]
        team_data.pop("creator_email", None)
        return team_db_handler.create(db, input_object=team_data), creator_email

    def update_team(self, decoded_token, request_payload: TeamSchema, team: Teams, db: Session):
        team_data = self.preprocess_team_data(
            decoded_token, request_payload, db)
        return team_db_handler.update(db=db, db_obj=team, input_object=team_data)


team_service = TeamService()
