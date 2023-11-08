import json
import os
import uuid
from typing import Optional
from backend.db_handler.user_handler import user_db_handler
from fastapi import FastAPI, Header, HTTPException, status, APIRouter, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from starlette.responses import JSONResponse
from starlette.requests import Request
from starlette.responses import RedirectResponse
from pydantic import BaseModel
import stripe
from backend.config import get_settings
from backend.db_handler.subscription_handler import subscription_db_handler
from backend.models.database import get_db
from sqlalchemy.orm import Session

webhook_router = APIRouter(prefix="/api/v1", tags=["Plans"])


settings = get_settings()

# Check if WEBHOOK_SECRET_KEY is defined
if settings.WEBHOOK_SECRET_KEY:
    endpoint_secret = settings.WEBHOOK_SECRET_KEY
else:
    raise ValueError("WEBHOOK_SECRET_KEY is not defined in the configuration.")


@webhook_router.post('/webhook', response_class=JSONResponse)
async def webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    event = None
    payload = await request.body()
    sig_header = request.headers['stripe-signature']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail=str(e))
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail=str(e))

    # Handle the event
    if event['type'] == 'checkout.session.async_payment_failed':
        session = event['data']['object']
        print('session ', session)
    elif event['type'] == 'checkout.session.async_payment_succeeded':
        session = event['data']['object']
        print('session checkout.session.async_payment_succeeded', session)
    elif event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        print("inside checkout session")
        if 'customer_details' in session:
            email = session['customer_details'].get('email')
        else:
            email = None

        subscription_id = session.get("subscription")

        if subscription_id:
            subscription = stripe.Subscription.retrieve(subscription_id)
            if 'items' in subscription and len(subscription['items']['data']) > 0:
                price_id = subscription['items']['data'][0]['price']['id']
            else:
                price_id = None

            user = user_db_handler.load_by_column(
                db=db,
                column_name="email",
                value=email
            )
            print('user81', user)
            customer_details = session.get("customer_details")
            address = customer_details.address
            print("address ", address)
            user_address = {"address": address}
            # print('user_address', user_address)
            user_db_handler.update(db=db, db_obj=user, input_object=user_address)

            if email and subscription_id and price_id:
                subscription_obj = {
                    "id": uuid.uuid4(),
                    "user_id": user.id,
                    "subscription_id": subscription_id,
                    "price_id": price_id,
                    "payment_status": session.get("payment_status")
                }
                subscription_db_handler.create(db=db, input_object=subscription_obj)
            else:
                print("Missing required data (email, subscription_id, or price_id)")

        print('session checkout.session.completed', session)

    elif event['type'] == 'checkout.session.expired':
        session = event['data']['object']
    # ... handle other event types
    else:
        return JSONResponse(content={'success': False, 'error': 'Unhandled event type'}, status_code=200)

    return JSONResponse(content={'success': True}, status_code=200)
