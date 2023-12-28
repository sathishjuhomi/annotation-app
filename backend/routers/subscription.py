
from typing import List
from backend.schemas.response.subscription import SubscriptionResponseSchema
from backend.schemas.response.user import DetailSchema
from backend.utils.utils import decode_token
from fastapi.security import HTTPBearer
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.models.database import get_db
from backend.service.subscription import subscription_service


subscription_router = APIRouter(prefix="/api/v1", tags=["Subscription"])
bearer = HTTPBearer()


@subscription_router.get('/subscribed-users',
                         description="This API endpoint displays subscribers in admin dashboard",
                         response_model=List[SubscriptionResponseSchema] | DetailSchema
                         )
def get_all_subscribed_users(
    db: Session = Depends(get_db),
    authorization: str = Depends(bearer)
):
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    return subscription_service.get_subscribers(decoded_token, db)


@subscription_router.patch("/cancel-subscription/{subscription_id}",
                           description="This API endpoint allow subscriber to cancel the subscription",
                           response_model=DetailSchema
                           )
def cancel_subscription(
        subscription_id: str,
        authorization: str = Depends(bearer),
        db: Session = Depends(get_db)
):
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    return subscription_service.cancel_subscription(
        db=db,
        subscription_id=subscription_id,
        decoded_token=decoded_token
    )
