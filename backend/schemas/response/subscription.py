from pydantic import BaseModel, UUID4, EmailStr
from datetime import datetime


class SubscriptionResponseSchema(BaseModel):
    email: EmailStr
    plan_name: str
    team_name: str
    subscription_id: str | None
    subscribed_on: datetime
    payment_status: str
    is_active: bool


class SubscriptionValidationResponseSchema(BaseModel):
    subscription_status: str
    plan_name: str | None
    price_id: str | None
