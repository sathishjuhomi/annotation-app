import json
import os
import uuid
from typing import Optional
from backend.db_handler.user_handler import user_db_handler
from backend.schemas.response.user import DetailSchema
from backend.service.webhook import webhook_service
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

checkout_session_completed = "checkout.session.completed"
checkout_session_expired = "checkout.session.expired"


@webhook_router.post('/webhook',
                     description="This API endpoint allow us to capture envents from stripe",
                     response_class=JSONResponse)
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
    if event['type'] == checkout_session_completed:
        session = event['data']['object']
        webhook_service.create_subscription(session, db=db)

    elif event['type'] == checkout_session_expired:
        session = event['data']['object']
        print('checkout.session.expired', session)

    # ... handle other event types
    else:
        return JSONResponse(content={'success': False, 'error': 'Unhandled event type'}, status_code=200)

    return JSONResponse(content={'success': True}, status_code=200)
