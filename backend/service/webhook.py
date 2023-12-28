from backend.config import get_settings
import stripe
import uuid
from backend.db_handler.subscription_handler import subscription_db_handler
from backend.utils.email_receipt import send_receipt_email

from sqlalchemy.orm import Session
from backend.db_handler.user_handler import user_db_handler
from fastapi import HTTPException, status


settings = get_settings()

# Check if STRIPE_SECRET_KEY is defined
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY
else:
    raise ValueError("STRIPE_SECRET_KEY is not defined in the configuration.")


class WebhookService():
    @staticmethod
    async def create_subscription(
            session,
            db: Session
    ):
        customer_id = session.get("customer")
        customer_email = session['customer_details'].get('email')
        subscription_id = session.get("subscription")
        metadata = session.get("metadata")
        price_id = metadata["price_id"]
        team_id = metadata["team_id"]
        invoice_id = session.get("invoice")

        invoice = stripe.Invoice.retrieve(invoice_id)
        charge_id = invoice.get("charge")

        charge = stripe.Charge.retrieve(
            charge_id,
        )

        receipt_url = charge.get("receipt_url")

        await send_receipt_email(email_to=customer_email, receipt_url=receipt_url)

        user = user_db_handler.load_by_column(
            db=db,
            column_name="id",
            value=customer_id
        )

        customer_details = session.get("customer_details")
        address = customer_details.address

        user_address = {"address": address}
        user_db_handler.update(db=db, db_obj=user, input_object=user_address)

        if subscription_id and not (customer_email and price_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing required details to update database"
            )

        subscription_obj = {
            "id": uuid.uuid4(),
            "user_id": user.id,
            "team_id": team_id,
            "subscription_id": subscription_id,
            "price_id": price_id,
            "payment_status": session.get("payment_status")
        }
        subscription_db_handler.create(db=db, input_object=subscription_obj)


webhook_service = WebhookService()
