from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from jinja2 import Environment, FileSystemLoader
from backend.config import get_settings
from backend.utils.utils import PASSWORD_REST_TOKEN_EXPIRY
from backend.utils.email_utils import conf, SERVER_HOST, EMAIL_TEMPLATES_DIR
from pydantic import UUID4

async def send_invitation_email(team_member_id: UUID4, team_name: str,email_from: str, email_to: str, invite_token: str) -> None:
    valid_hours = PASSWORD_REST_TOKEN_EXPIRY / 60
    link = f"{SERVER_HOST}/accept-invitation?token={invite_token}&team_id={team_member_id}&team_name={team_name}&email_from={email_from}&email_to={email_to}"
    env = Environment(loader=FileSystemLoader(EMAIL_TEMPLATES_DIR))
    template = env.get_template("accept_team_invitation.html")
    formatted_template = template.render(
        email=email_to, link=link, valid_hours=valid_hours
    )
    message = MessageSchema(
        subject="Team Invitation",
        recipients=[email_to],
        body=formatted_template,
        subtype="html",
    )
    fm = FastMail(conf)
    await fm.send_message(message)
