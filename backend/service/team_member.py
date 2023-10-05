from typing import List
import uuid
from backend.schemas.response.team import TeamResponseSchema
from datetime import datetime
from backend.schemas.response.user import DetailSchema

from pydantic import UUID4
from sqlalchemy.orm import Session
from backend.utils.utils import create_access_token
from backend.utils.email_team_member import send_invitation_email
from backend.db_handler.team_member_handler import team_member_db_handler
from backend.models.team_member import TeamMembers


class TeamMemberService():
    @staticmethod
    def add_team_member(team_id, email, invited_by_id, role: dict, is_activated: bool, is_declined: bool):
        team_member_data = {
            "id": uuid.uuid4(),
            "team_id": team_id,
            "email": email,
            "invited_by_id": invited_by_id,
            "roles": role,
            "is_activated": is_activated,
            "is_declined": is_declined
        }
        return team_member_data

    @staticmethod
    def get_by_team_id_and_email(db: Session, team_id: str, email: str):
        return db.query(TeamMembers).filter_by(team_id=team_id, email=email).first()

    async def email_invitation(self, team_id, decoded_token, request_payload, db: Session):
        try:
            member_detail = request_payload.model_dump()

            invitor_detail = team_member_db_handler.load_by_column(
                db=db, column_name="email", value=decoded_token["email"])

            # Check if the inviter has 'owner' or 'admin' roles
            if not (invitor_detail.roles['owner'] or invitor_detail.roles['admin']):
                raise Exception(
                    'Only Admin or Owner of the team can invite a team member')

            # Create team member data for database insertion
            team_member_data = team_member_service.add_team_member(team_id=team_id,
                                                                   email=member_detail["email"],
                                                                   invited_by_id=decoded_token["id"],
                                                                   role=member_detail["role"],
                                                                   is_activated=False,
                                                                   is_declined=False)

            member_detail['team_id'] = str(team_id)
            member_detail.pop('role', None)
            # Create an access token for the invitation
            invitation_token = create_access_token(member_detail)

            # Insert the team member data into the database
            _ = team_member_db_handler.create(
                db=db, input_object=team_member_data)

            # Get the email from the request payload and send an invitation email
            email = member_detail["email"]
            await send_invitation_email(email_to=email, token=invitation_token)

            return {"detail": f"{email} invited successfully"}

        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def update_team_member_as_active(decoded_token: dict,
                                     team_member: TeamMembers,
                                     db: Session):
        decoded_token["is_activated"] = True

        return team_member_db_handler.update(db=db,
                                             db_obj=team_member,
                                             input_object=decoded_token)

    def delete_team_members(self, db, team_id, deleter_id):
        team_members = team_member_db_handler.load_all_by_column(
            db=db, column_name='team_id', value=team_id)
        input_data_list = [
            {
                "is_deleted": True,
                "is_activated": False,
                "t_delete": datetime.now(),
                "deleted_by_id": deleter_id
            }
            for _ in team_members
        ]
        db_objs = list(team_members)
        _ = team_member_db_handler.bulk_update(
            db=db, db_objs=db_objs, input_data_list=input_data_list)

    @staticmethod
    async def delete_team_member(decoded_token, team_id, id, db):
        """
        validate the token
        check the current user role, owner or admin
        If owner or admin, get the team member with member id from team member table
        or raise exception
        create a dict with key is_deleted and value True,
          key deleted_by_id and value current user id
        call the update method
        """
        deleter_detail = team_member_db_handler.load_by_column(
            db=db, column_name="email", value=decoded_token["email"])

        # Check if the inviter has 'owner' or 'admin' roles
        if not (deleter_detail.roles['owner'] or deleter_detail.roles['admin']):
            raise Exception(
                'Only Admin or Owner of the team can delete a team member')

        team_member_detail = team_member_db_handler.load_by_column(
            db=db, column_name="id", value=id)

        member_detail = {
            "is_activated": False,
            "is_deleted": True,
            "deleted_by_id": decoded_token["id"],
            "t_delete": datetime.now()
        }

        team_member_db_handler.update(db=db,
                                      db_obj=team_member_detail,
                                      input_object=member_detail)
        detail_message = f"{team_member_detail.email} deleted successfully"
        return DetailSchema(detail=detail_message)


team_member_service = TeamMemberService()
