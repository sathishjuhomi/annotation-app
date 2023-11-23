from pydantic import BaseModel


class UpdatePlanSchema(BaseModel):
    plan_name: str
    description: str | None


class UpdatePriceSchema(BaseModel):
    price: float
    currency: str
    payment_mode: str
    payment_type: str
    billing_period: str | None
    interval_count: int | None


class PlanRequestSchema(BaseModel):
    plan: UpdatePlanSchema
    price: UpdatePriceSchema


class PriceStateRequestSchema(BaseModel):
    active: bool

class CheckoutSessionRequestSchema(BaseModel):
    payment_type: str