import uuid
from backend.schemas.request.team import TeamSchema

from pydantic import UUID4
from sqlalchemy.orm import Session
from backend.utils.utils import create_access_token
from backend.utils.email_team_member import send_invitation_email
from backend.utils.utils import get_user_detail
from backend.db_handler.team_member_handler import team_member_db_handler
from backend.models.team_member import TeamMembers


class TeamMemberService():
    @staticmethod
    def add_team_creator_as_team_member(created_team: TeamSchema,
                                        creator_email: str,
                                        db: Session):
        team_member_data = {
            "id": uuid.uuid4(),
            "team_id": created_team.id,
            "email": creator_email,
            "roles": {
                "owner": True,
                "admin": True,
                "member": False},
            "activated": True,
            "declined": False
        }
        return team_member_db_handler.create(db=db, input_object=team_member_data)

    @staticmethod
    def team_member_data(member_detail: dict, invited_by_id: UUID4) -> dict:
        team_member_data = {
            "id": uuid.uuid4(),
            "team_id": member_detail['team_id'],
            "email": member_detail["email"],
            "invited_by_id": invited_by_id,
            "roles": member_detail["role"],
            "activated": False,
            "declined": False
        }
        return team_member_data

    async def email_invitation(self, request_payload, db: Session):
        try:
            member_detail = request_payload.model_dump()

            # Get the user ID of the inviter from the token
            invitor, _ = get_user_detail(member_detail["token"], db)
            invitor_detail = team_member_db_handler.load_by_column(
                db=db, column_name="email", value=invitor.email)

            # Check if the inviter has 'owner' or 'admin' roles
            if not (invitor_detail.roles['owner'] or invitor_detail.roles['admin']):
                raise Exception(
                    'Only Admin or Owner of the team can invite a team member')

            member_detail['team_id'] = str(member_detail['team_id'])
            member_detail['activated'] = False
            member_detail.pop("token", None)

            # Create an access token for the invitation
            token = create_access_token(member_detail)

            # Create team member data for database insertion
            team_member_data = self.team_member_data(
                member_detail, invitor_detail.id)

            # Insert the team member data into the database
            _ = team_member_db_handler.create(
                db=db, input_object=team_member_data)

            # Get the email from the request payload and send an invitation email
            email = member_detail["email"]
            await send_invitation_email(email_to=email, token=token)

            return {"detail": f"{email} invited successfully"}

        except Exception as e:
            return {"error": str(e)}

    def update_team_member_as_active(self, token: str,
                                     team_member: TeamMembers,
                                     db: Session):
        user, decoded_token = get_user_detail(token=token, db=db)
        decoded_token["activated"] = True

        return team_member_db_handler.update(db=db,
                                             db_obj=team_member,
                                             input_object=decoded_token)


team_member_service = TeamMemberService()
