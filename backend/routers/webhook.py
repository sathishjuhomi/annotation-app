import json
import os
from typing import Optional
from fastapi import FastAPI, Header, HTTPException, status, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from starlette.responses import JSONResponse
from starlette.requests import Request
from starlette.responses import RedirectResponse
from pydantic import BaseModel
import stripe
from backend.config import get_settings


webhook_router = APIRouter(prefix="/api/v1", tags=["Plans"])


settings = get_settings()

# Check if WEBHOOK_SECRET_KEY is defined
if settings.WEBHOOK_SECRET_KEY:
    endpoint_secret = settings.WEBHOOK_SECRET_KEY
else:
    raise ValueError("WEBHOOK_SECRET_KEY is not defined in the configuration.")

@webhook_router.post('/webhook', response_class=JSONResponse)
async def webhook(request: Request):
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
        print('session checkout.session.completed', session)
        subscription_id = session.get("subscription")
        subscription = stripe.Subscription.retrieve(subscription_id)
        items = subscription['items']['data']

        for item in items:
            price_id = item['price']['id']
            print('price_id ', price_id)
            product = stripe.Product.retrieve(item['price']['product'])
            print(f"Product ID: {product['id']}, Name: {product['name']}")

    elif event['type'] == 'checkout.session.expired':
        session = event['data']['object']
    # ... handle other event types
    else:
        return JSONResponse(content={'success': False, 'error': 'Unhandled event type'}, status_code=200)

    return JSONResponse(content={'success': True}, status_code=200)