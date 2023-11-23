from backend.db_handler.subscription_handler import subscription_db_handler
from backend.utils.utils import admin_role_validataion
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import stripe
from backend.config import get_settings

settings = get_settings()
# Check if STRIPE_SECRET_KEY is defined
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY
else:
    raise ValueError("STRIPE_SECRET_KEY is not defined in the configuration.")


class SubscriptionService():
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

    @staticmethod
    def subscription_obj_to_dict(subscription):
        return {
            'email': subscription.user.email,
            'plan_name': subscription.plan.plan_name,
            'subscription_id': subscription.subscription_id,
            'subscribed_on': subscription.t_create,
            'payment_status': subscription.payment_status,
            'is_active': subscription.is_active,
        }

    def get_subscribers(
            self,
            decoded_token: dict,
            db: Session
    ):
        admin_role_validataion(decoded_token=decoded_token, db=db)

        responses = subscription_db_handler.load_all(db=db)

        result = [self.subscription_obj_to_dict(
            response) for response in responses]

        return result


subscription_service = SubscriptionService()
