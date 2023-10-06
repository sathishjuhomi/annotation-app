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
    def add_team_member(id, team_id, email, invited_by_id, role: dict, is_activated: bool, is_declined: bool):
        team_member_data = {
            "id": id,
            "team_id": team_id,
            "email": email,
            "invited_by_id": invited_by_id,
            "roles": role,
            "is_activated": is_activated,
            "is_declined": is_declined
        }
        return team_member_data

    @staticmethod
    def role_validation(decoded_token, db: Session):
        team_member = team_member_db_handler.load_by_column(
            db=db, column_name="email", value=decoded_token["email"])

        # Check if the inviter has 'owner' or 'admin' roles
        if not (team_member.roles['owner'] or team_member.roles['admin']):
            raise Exception(
                'Only Admin or Owner of the team have access to modify the team')

    async def email_invitation(self, team_id, decoded_token, request_payload, db: Session):
        try:
            member_detail = request_payload.model_dump()

            # Check if the inviter has 'owner' or 'admin' roles
            self.role_validation(decoded_token, db)

            id = uuid.uuid4()
            # Create team member data for database insertion

            team_member_data = self.add_team_member(id=id,
                                                    team_id=team_id,
                                                    email=member_detail["email"],
                                                    invited_by_id=decoded_token["id"],
                                                    role=member_detail["role"],
                                                    is_activated=False,
                                                    is_declined=False)

            to_create_access_token = {
                'id': str(id), 'email': member_detail["email"]}
            # Create an access token for the invitation
            invitation_token = create_access_token(to_create_access_token)

            # Insert the team member data into the database
            _ = team_member_db_handler.create(
                db=db, input_object=team_member_data)

            # Get the email from the request payload and send an invitation email
            email = member_detail["email"]
            await send_invitation_email(email_to=email, token=invitation_token)

            return {"detail": f"{email} invited successfully"}

        except Exception as e:
            return {"error": str(e)}

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

    async def delete_member(self, decoded_token, id, db):
        """
        validate the token
        check the current user role, owner or admin
        If owner or admin, get the team member with member id from team member table
        or raise exception
        create a dict with key is_deleted and value True,
          key deleted_by_id and value current user id
        call the update method
        """
        # Check if the inviter has 'owner' or 'admin' roles
        self.role_validation(decoded_token, db)

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

        return {"detail": f"{team_member_detail.email} deleted successfully"}


team_member_service = TeamMemberService()
