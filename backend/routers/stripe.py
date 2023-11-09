from backend.schemas.request.plan import CheckoutSessionRequestSchema
from backend.schemas.response.user import DetailSchema
from backend.service.stripe import stripe_service
from backend.utils.utils import decode_token

from fastapi.security import HTTPBearer
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.models.database import get_db
import stripe
from starlette.responses import RedirectResponse


stripe_router = APIRouter(prefix="/api/v1", tags=["Stripe"])

bearer = HTTPBearer()


@stripe_router.post('/create-checkout-session/plans/{price_id}',
                    description="This API endpoint displays checkout page for subscribers"
                    )
def create_checkout_session(
    price_id: str,
    request_payload: CheckoutSessionRequestSchema
):
    plan_data = request_payload.model_dump()

    payment_mode = "subscription" if plan_data["payment_type"] == "recurring" else "payment"

    checkout_session = stripe.checkout.Session.create(
        success_url='http://localhost:3000/signin',
        cancel_url='http://localhost:3000/signin',


        # payment_method_types=(os.getenv('PAYMENT_METHOD_TYPES') or 'card').split(','),

        mode=payment_mode,
        line_items=[{
            'price': price_id,
            'quantity': 1,
        }],
        billing_address_collection='required',  # Collect billing address
        # phone_number_collection={"enabled": True}
    )
    print(checkout_session)
    return RedirectResponse(
        checkout_session.url,
        status.HTTP_303_SEE_OTHER
    )


@stripe_router.get("/cancel-subscription/{subscription_id}",
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
    return stripe_service.cancel_subscription(
        db=db,
        subscription_id=subscription_id,
        decoded_token=decoded_token
    )
