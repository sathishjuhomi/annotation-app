from backend.schemas.request.plan import PlanRequestSchema
from pydantic import BaseModel, UUID4


class PlanResponseSchema(PlanRequestSchema):
    id: UUID4
    price_id: str
