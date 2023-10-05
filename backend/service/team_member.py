import uuid
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

            member_detail['team_id'] = str(team_id)
            print('member_detail ', member_detail)

            # Create an access token for the invitation
            invitation_token = create_access_token(member_detail)

            # Create team member data for database insertion
            team_member_data = self.add_team_member(team_id=team_id,
                                                                   email=member_detail["email"],
                                                                   invited_by_id=None,
                                                                   role=member_detail["role"],
                                                                   is_activated=False,
                                                                   is_declined=False)

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


team_member_service = TeamMemberService()
