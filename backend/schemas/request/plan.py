from pydantic import BaseModel


class PlanRequestSchema(BaseModel):
    plan_name: str
    description: str
    price: float
    currency: str
    payment_mode: str
    payment_type: str
    billing_period: str | None
    interval_count: int | None
