from pydantic import BaseModel, UUID4, EmailStr
from datetime import datetime


class SubscriptionResponseSchema(BaseModel):
    email: EmailStr
    plan_name: str
    subscription_id: str
    subscribed_on: datetime
    payment_status: str
    is_active: bool
