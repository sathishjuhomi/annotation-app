from typing import Optional
import uuid
from datetime import datetime
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
    def get_team_members_detail_with_team_id(db: Session, id, decoded_token: dict):
        filters = {
            'team_id': id,
            'is_deleted': False,
            'is_declined': False
        }
        loggedin_email = decoded_token.get('email')
        team_members = team_member_db_handler.load_all_by_columns(
            db=db, filters=filters)
        team_members_details = [
            {
                "team_member_id": team_member.id,
                "email": team_member.email,
                "is_activated": team_member.is_activated,
                "roles": team_member.roles,
                "invite_token": team_member.invite_token,
                "is_action": (team_member.email == loggedin_email) and
                            (team_member.roles.get('owner') or team_member.roles.get('admin'))
            }
            for team_member in team_members
        ]
        return team_members_details

    @staticmethod
    def role_validation(filters: dict, db: Session):
        team_member = team_member_db_handler.load_all_by_columns(
            db=db, filters=filters)
        # Check if the inviter has 'owner' or 'admin' roles
        if not (team_member[0].roles['owner'] or team_member[0].roles['admin']):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Owner or Admin can modify the team"
            )
        return team_member

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
            filters = {"email": decoded_token["email"],
                       "team_id": str(team_id)}
            _ = self.role_validation(filters=filters, db=db)

            member_detail = request_payload.model_dump()

            member = db.query(TeamMembers).filter_by(
                team_id=team_id, email=member_detail["email"]).first()

            if member:
                # Common logic for both is_declined and is_deleted flags
                to_create_access_token = {
                    'id': str(member.id), 'email': member.email}
                invitation_token = create_access_token(to_create_access_token)

                update_flag = {}
                if member.is_declined:
                    update_flag = {
                        "is_declined": False, "invited_by_id": decoded_token["id"],
                        "invite_token": invitation_token, "roles": member_detail["roles"]}
                elif member.is_deleted:
                    update_flag = {
                        "is_deleted": False, "invited_by_id": decoded_token["id"],
                        "invite_token": invitation_token, "deleted_by_id": None,
                        "t_delete": None, "roles": member_detail["roles"]}

                if update_flag:
                    response = team_member_db_handler.update(
                        db=db, db_obj=member, input_object=update_flag)
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
                    role=member_detail["roles"])
                _ = team_member_db_handler.create(
                    db=db, input_object=team_member_data)

            email = member_detail["email"]

            # Send an invitation email
            await send_invitation_email(email_to=email, invite_token=invitation_token)

            return {"detail": f"{email} invited successfully"}

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"{str(e)}"
            )

    async def resend_invitation(self, team_id, team_member_id, decoded_token, db: Session):

        try:
            filters = {"email": decoded_token["email"],
                       "team_id": str(team_id)}
            # Check if the inviter has 'owner' or 'admin' roles
            _ = self.role_validation(filters=filters, db=db)

            team_member = team_member_db_handler.load_by_column(
                db=db, column_name="id", value=team_member_id)

            if team_member:
                to_create_access_token = {
                    'id': str(team_member.id),
                    'email': team_member.email
                }
                # Create an access token for the invitation
                invitation_token = create_access_token(to_create_access_token)

                update_invite_token = {
                    "invite_token": invitation_token, "invited_by_id": decoded_token["id"]}
                _ = team_member_db_handler.update(
                    db=db, db_obj=team_member, input_object=update_invite_token)

            # Send an invitation email
            await send_invitation_email(email_to=team_member.email, invite_token=invitation_token)

            return {"detail": f"{team_member.email} invited successfully"}

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"{str(e)}"
            )

    def delete_member(self, decoded_token, team_id, team_member_id, db):
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
        filters = {"email": decoded_token["email"],
                   "team_id": str(team_id)}
        _ = self.role_validation(filters=filters, db=db)
        team_member_detail = team_member_db_handler.load_by_column(
            db=db, column_name="id", value=team_member_id)

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

    def update_team_member_role(self, db, team_id, team_member_id, request_payload, decoded_token):
        filters = {"email": decoded_token["email"],
                   "team_id": str(team_id)}
        signed_user = self.role_validation(filters=filters, db=db)
        member_role = request_payload.model_dump()
        team_member_detail = team_member_db_handler.load_by_column(db=db,
                                                                   column_name="id",
                                                                   value=team_member_id)

        if (signed_user[0].roles['admin'] or signed_user[0].roles['member']) and not signed_user[0].roles['owner']:
            if team_member_detail.roles['owner']:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Admin or Member can't change the privilege of team owner",
                )

        if signed_user[0].roles["owner"]:
            if member_role["roles"]["owner"] or member_role["roles"]["owner"] == False:
                team_member_db_handler.update(db=db,
                                              db_obj=team_member_detail,
                                              input_object=member_role)
                return {"detail": f"{team_member_detail.email} role updated successfully"}

        if signed_user[0].roles["admin"]:
            if member_role["roles"]["owner"] == False:
                team_member_db_handler.update(db=db,
                                              db_obj=team_member_detail,
                                              input_object=member_role)
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only owner can give owner privilege to team members",
                )
            return {"detail": f"{team_member_detail.email} role updated successfully"}


team_member_service = TeamMemberService()
