from backend.db_handler.plan_handler import plan_db_handler
from backend.db_handler.subscription_handler import subscription_db_handler
from backend.utils.utils import admin_role_validataion
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import stripe
from backend.config import get_settings
from datetime import datetime
from pydantic import UUID4

settings = get_settings()
# Check if STRIPE_SECRET_KEY is defined
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY
else:
    raise ValueError("STRIPE_SECRET_KEY is not defined in the configuration.")


class SubscriptionService():

    @staticmethod
    def validate_subscription(db: Session, team_id: UUID4):
        filters = {
            'is_active': True,
            'team_id': team_id,
        }
        subscription_db_response = subscription_db_handler.load_all_by_columns(
            db=db, filters=filters)
        if subscription_db_response:
            if subscription_db_response[0].subscription_id:
                # In recurring subscription we have subscription id so we need to check the recurring payment in stripe if it occur periodically
                # stripe doc for subscription objects https://stripe.com/docs/api/subscriptions/object
                subscription_id = subscription_db_response[0].subscription_id
                subscription_response = stripe.Subscription.retrieve(
                    subscription_id)
                subscription_status = subscription_response.get("status")
                current_period_start = subscription_response.get(
                    "current_period_start")
                current_period_end = subscription_response.get(
                    "current_period_end")

                subscription_start_datetime = datetime.fromtimestamp(
                    current_period_start)
                subscription_end_datetime = datetime.fromtimestamp(
                    current_period_end)

                current_datetime = datetime.now()

                if not (subscription_start_datetime <= current_datetime <= subscription_end_datetime):
                    update_subscription_status = {
                        "payment_status": subscription_status,
                        "is_active": False
                    }
                    subscription_db_handler.update(
                        db=db, db_obj=subscription_db_response[0],
                        input_object=update_subscription_status
                    )

                data_response = subscription_response.get(
                    "items", {}).get("data", [])
                plan_id = data_response[0]["price"]["product"]
                price_id = data_response[0]["price"]["id"]

                plan_db_response = plan_db_handler.load_by_column(
                    db=db, column_name="id", value=plan_id)

                plan_name = plan_db_response.plan_name
                response = {
                    "subscription_status": subscription_status,
                    "plan_name": plan_name,
                    "price_id": price_id
                }
                return response
            else:
                # One time payment will not have any subscripiton id by default so we can check our db for status.
                response = {
                    "subscription_status": "active" if subscription_db_response[0].is_active else "unpaid",
                    "plan_name": subscription_db_response[0].plan.plan_name,
                    "price_id": subscription_db_response[0].price_id
                }
                return response
        return None

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
            'team_name': subscription.team.team_name,
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
