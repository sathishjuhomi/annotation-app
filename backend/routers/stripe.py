from backend.db_handler.subscription_handler import subscription_db_handler
from backend.schemas.request.plan import CheckoutSessionRequestSchema
from backend.utils.utils import decode_token
from pydantic import UUID4
from fastapi.security import HTTPBearer
from fastapi import HTTPException, APIRouter, status, Depends
import stripe
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session
from backend.models.database import get_db

stripe_router = APIRouter(prefix="/api/v1", tags=["Stripe"])

bearer = HTTPBearer()


@stripe_router.post('/checkout-session/teams/{team_id}',
                    description="This API endpoint displays checkout page for subscribers"
                    )
def create_checkout_session(
    team_id: UUID4,
    price_id: str,
    request_payload: CheckoutSessionRequestSchema,
    authorization: str = Depends(bearer),
    db: Session = Depends(get_db)
):
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    plan_data = request_payload.model_dump()
    filters = {
        "team_id": team_id,
        "is_active": True
    }
    subscription_data = subscription_db_handler.load_all_by_columns(db=db, filters=filters)
    if subscription_data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Team subscription already exist"
        )
    payment_mode = "subscription" if plan_data["payment_type"] == "recurring" else "payment"

    checkout_session = stripe.checkout.Session.create(
        customer_email= decoded_token["email"],
        success_url='http://localhost:3000/signin',
        cancel_url='http://localhost:3000/signin',
        # payment_method_types=(os.getenv('PAYMENT_METHOD_TYPES') or 'card').split(','),
        mode=payment_mode,
        line_items=[{
            'price': price_id,
            'quantity': 1,
        }],
        billing_address_collection='required', # Collect billing address
        metadata={"team_id":team_id, "price_id":price_id} # data that we need in webhook output
        # phone_number_collection={"enabled": True}
    )
    print(checkout_session)
    redirect_url = {"url": checkout_session.url}

    return redirect_url

