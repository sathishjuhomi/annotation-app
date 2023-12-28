from annotation.backend.utils.email_utils import EMAIL_TEMPLATES_DIR
from fastapi_mail import FastMail, MessageSchema
from jinja2 import Environment, FileSystemLoader
from annotation.backend.utils.email_utils import conf

async def send_receipt_email(email_to: str, receipt_url: str) -> None:
    # valid_hours = PASSWORD_REST_TOKEN_EXPIRY / 60
    # link = f"{FRONTEND_SERVER_HOST}/accept-invitation?token={invite_token}"
    env = Environment(loader=FileSystemLoader(EMAIL_TEMPLATES_DIR))
    template = env.get_template("send_receipt.html")
    formatted_template = template.render(
        email=email_to, link=receipt_url
    )
    message = MessageSchema(
        subject="BILL",
        recipients=[email_to],
        body=formatted_template,
        subtype="html",
    )
    fm = FastMail(conf)
    await fm.send_message(message)