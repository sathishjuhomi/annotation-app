from backend.config import get_settings
import stripe
import uuid
from backend.db_handler.subscription_handler import subscription_db_handler
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
    def create_subscription(
            session,
            db: Session
    ):

        email = session['customer_details'].get('email')
        subscription_id = session.get("subscription")
        metadata = session.get("metadata")
        price_id = metadata["price_id"]
        team_id = metadata["team_id"]

        user = user_db_handler.load_by_column(
            db=db,
            column_name="email",
            value=email
        )

        customer_details = session.get("customer_details")
        address = customer_details.address

        user_address = {"address": address}
        user_db_handler.update(db=db, db_obj=user, input_object=user_address)

        if not email and subscription_id and price_id:
            raise HTTPException(
                status_code=status.status.HTTP_400_BAD_REQUEST,
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
