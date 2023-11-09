import stripe
from backend.db_handler.subscription_handler import subscription_db_handler
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.config import get_settings

settings = get_settings()

# Check if STRIPE_SECRET_KEY is defined
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY
else:
    raise ValueError("STRIPE_SECRET_KEY is not defined in the configuration.")


class StripeService():
    @staticmethod
    def cancel_subscription(
            subscription_id: str,
            decoded_token: dict,
            db: Session
    ):
        subscription_data = subscription_db_handler.load_by_column(
            db=db,
            column_name="subscription_id",
            value=subscription_id
        )

        email = subscription_data.user.email
        if not (decoded_token["email"] == email):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only subscriber can cancel the subscription"
            )
        if not subscription_data.is_active == True:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Subscription is already Inactive"
            )
        stripe.Subscription.delete(
            subscription_id,
        )
        cancel_obj = {"is_active": False}

        subscription_db_handler.update(
            db=db,
            db_obj=subscription_data,
            input_object=cancel_obj
        )
        return {"detail": "Your subscription has been successfully cancelled"}


stripe_service = StripeService()
