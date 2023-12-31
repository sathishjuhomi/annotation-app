from fastapi_mail import FastMail, MessageSchema
from jinja2 import Environment, FileSystemLoader
from backend.utils.email_utils import conf, FRONTEND_SERVER_HOST, EMAIL_TEMPLATES_DIR


async def send_invitation_email(email_to: str, invite_token: str) -> None:
    link = f"{FRONTEND_SERVER_HOST}/accept-invitation?token={invite_token}"
    env = Environment(loader=FileSystemLoader(EMAIL_TEMPLATES_DIR))
    template = env.get_template("accept_team_invitation.html")
    formatted_template = template.render(
        email=email_to, link=link
    )
    message = MessageSchema(
        subject="Team Invitation",
        recipients=[email_to],
        body=formatted_template,
        subtype="html",
    )
    fm = FastMail(conf)
    await fm.send_message(message)
