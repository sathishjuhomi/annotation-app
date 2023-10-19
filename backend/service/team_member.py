from typing import Optional
import uuid
from datetime import datetime
from backend.db_handler.team_handler import team_db_handler
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.utils.utils import create_access_token
from backend.utils.email_team_member import send_invitation_email
from backend.db_handler.team_member_handler import team_member_db_handler
from backend.models.team_member import TeamMembers


class TeamMemberService():
    @staticmethod
    def add_team_member(id, team_id, email, invited_by_id,
                        invite_token: Optional[str],
                        role: dict,
                        is_activated: Optional[bool] = False,
                        is_declined: Optional[bool] = False):
        team_member_data = {
            "id": id,
            "team_id": team_id,
            "email": email,
            "invited_by_id": invited_by_id,
            "invite_token": invite_token,
            "roles": role,
            "is_activated": is_activated,
            "is_declined": is_declined
        }
        return team_member_data

    @staticmethod
    def get_team_members_detail_with_team_id(db: Session, id):
        filters = {
            'team_id': id,
            'is_deleted': False,
            'is_declined': False
        }

        team_members = team_member_db_handler.load_all_by_columns(
            db=db, filters=filters)
        team_members_details = [
            {
                "team_member_id": team_member.id,
                "email": team_member.email,
                "is_activated": team_member.is_activated,
                "roles": team_member.roles,
                "invite_token": team_member.invite_token,
            }
            for team_member in team_members
        ]
        return team_members_details

    @staticmethod
    def role_validation(decoded_token, db: Session):
        team_member = team_member_db_handler.load_by_column(
            db=db, column_name="email", value=decoded_token["email"])

        # Check if the inviter has 'owner' or 'admin' roles
        if not (team_member.roles['owner'] or team_member.roles['admin']):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Owner or Admin can modify the team"
            )

    @staticmethod
    async def delete_team_members(db, team_id, deleter_id):
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

    async def email_invitation(self, team_id, decoded_token, request_payload, db: Session):

        try:
            # Check if the inviter has 'owner' or 'admin' roles
            self.role_validation(decoded_token, db)

            member_detail = request_payload.model_dump()

            member = db.query(TeamMembers).filter_by(
                team_id=team_id, email=member_detail["email"]).first()
            
            if member:
                update_declined_flag = {
                    "is_declined": False, "invited_by_id": decoded_token["id"]}
                response = team_member_db_handler.update(db=db, db_obj=member, input_object=update_declined_flag)
                invitation_token = response.invite_token
            else:
                id = uuid.uuid4()
                to_create_access_token = {
                    'id': str(id),
                    'email': member_detail["email"]
                }
                # Create an access token for the invitation
                invitation_token = create_access_token(to_create_access_token)
                team_member_data = self.add_team_member(
                    id=id, team_id=team_id, email=member_detail["email"],
                    invited_by_id=decoded_token["id"], invite_token=invitation_token,
                      role=member_detail["role"])
                _ = team_member_db_handler.create(db=db, input_object=team_member_data)

            email = member_detail["email"]

            # Send an invitation email
            await send_invitation_email(email_to=email, invite_token=invitation_token)

            return {"detail": f"{email} invited successfully"}

        except Exception as e:
            return {"error": str(e)}

    def delete_member(self, decoded_token, id, db):
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

        email = team_member_detail.email

        if team_member_detail.is_deleted == True:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{email} has already deleted"
            )

        member_detail = {
            "is_activated": False,
            "is_deleted": True,
            "deleted_by_id": decoded_token["id"],
            "t_delete": datetime.now()
        }
        print('member_detail ', member_detail)

        team_member_db_handler.update(db=db,
                                      db_obj=team_member_detail,
                                      input_object=member_detail)

        return {"detail": f"{email} deleted successfully"}


team_member_service = TeamMemberService()
