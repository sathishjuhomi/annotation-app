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

    def delete_team(self, team: Teams, db: Session, deleter_id=id):
        update_data = {
            "is_deleted": True,
            "t_delete": datetime.now(),
            "deleted_by_id": deleter_id
        }
        return team_db_handler.update(db=db, db_obj=team, input_object=update_data)

    def get_teams_for_current_user(self, token: str, db: Session):
        team_member_detail = get_user_detail(decoded_token=token, db=db)

        # Load teams based on the user's email
        teams = team_member_db_handler.load_all_by_column(
            db=db, column_name='email', value=team_member_detail.email)

        if not teams:
            return {"detail": "No Teams Found"}

        # Construct a list of team details for the user
        team_details = []
        for team_member in teams:
            team = team_member.team
            team_detail = {
                "team_id": team.id,
                "team_name": team.team_name,
                "is_activated": team_member.is_activated,
                "roles": team_member.roles,
            }
            team_details.append(team_detail)
        return team_details

    def get_team_or_raise_404(self, db: Session, id: Optional[UUID4] = None, name: Optional[str] = None):
        if id is not None:
            team = team_db_handler.load_by_id(db=db, id=id)
            if not team:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="team not found"
                )
            return team
        if name is not None:
            team = team_db_handler.load_by_column(
                db=db, column_name="team_name", value=name)
            if team:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Team name already exist"
                )
            return team

    def get_team_members_detail_with_team_id(self, db: Session, id):
        team = self.get_team_or_raise_404(db, id=id)
        team_members = team_member_db_handler.load_all_by_column(
            db=db, column_name='team_id', value=id)
        team_members_details = []
        for team_member in team_members:
            team_members_details.append({
                "team_member_id": team_member.id,
                "email": team_member.email,
                "is_activated": team_member.is_activated,
                "roles": team_member.roles,
            })
            print("team_member ", vars(team_member))
        return {"team": team, "team_members": team_members_details}


team_service = TeamService()
