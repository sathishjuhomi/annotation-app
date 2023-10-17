from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from jinja2 import Environment, FileSystemLoader
from pydantic import UUID4
from backend.config import get_settings
from backend.utils.utils import PASSWORD_REST_TOKEN_EXPIRY
from backend.utils.email_utils import conf, SERVER_HOST, EMAIL_TEMPLATES_DIR


async def send_invitation_email(email_to: str, team_id: UUID4, token: str) -> None:
    valid_hours = PASSWORD_REST_TOKEN_EXPIRY / 60
    link = f"{SERVER_HOST}/api/v1/accept-invitation?token={token}&id={team_id}&email={email_to}"
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
