from annotation.backend.db_handler.subscription_handler import subscription_db_handler
from annotation.backend.schemas.request.plan import CheckoutSessionRequestSchema
from annotation.backend.service.team_member import team_member_service
from annotation.backend.utils.utils import decode_token
from pydantic import UUID4
from fastapi.security import HTTPBearer
from fastapi import HTTPException, APIRouter, status, Depends
import stripe
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session
from annotation.backend.models.database import get_db

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
    filters = {"email": decoded_token["email"],
               "team_id": str(team_id)}
    _ = team_member_service.role_validation(filters, db)
    customer_id = decoded_token["id"]
    customer_email = decoded_token["email"]
    plan_data = request_payload.model_dump()
    filters = {
        "team_id": team_id,
        "is_active": True
    }
    subscription_data = subscription_db_handler.load_all_by_columns(
        db=db, filters=filters)
    if subscription_data:
        return {"url":"http://localhost:3000/teams"}
        # raise HTTPException(
        #     status_code=status.HTTP_409_CONFLICT,
        #     detail="Team subscription already exist"
        # )
        
    payment_mode = "subscription" if plan_data["payment_type"] == "recurring" else "payment"
    try:
        customer = stripe.Customer.retrieve(customer_id)
    except stripe.error.StripeError as e:
        customer = None
    if not customer:
        customer = stripe.Customer.create(
            id=customer_id,
            email=customer_email,
    )
    stripe_params = {
        'customer': customer.id,
        # 'customer_email': decoded_token["email"],
        'success_url': 'http://localhost:3000/signin',
        'cancel_url': 'http://localhost:3000/signin',
        'mode': payment_mode,
        'line_items': [{
            'price': price_id,
            'quantity': 1,
        }],
        'billing_address_collection': 'required',  # Collect billing address
        # Data needed in webhook output
        'metadata': {"team_id": team_id, "price_id": price_id},
    }

    # Add invoice_creation parameter when payment_mode is "payment"
    if payment_mode == "payment":
        stripe_params['invoice_creation'] = {"enabled": True}

    checkout_session = stripe.checkout.Session.create(**stripe_params)

    redirect_url = {"url": checkout_session.url}
    return redirect_url
