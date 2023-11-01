from typing import Any
from backend.schemas.request.plan import PlanRequestSchema
from backend.schemas.response.user import DetailSchema
from backend.service.plan import plan_service
from fastapi.security import HTTPBearer
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.models.database import get_db
from backend.utils.utils import decode_token


plan_router = APIRouter(prefix="/api/v1", tags=["Plans"])


bearer = HTTPBearer()


@plan_router.post(
    "/plan",
    description="This API endpoint allows owner to create pricing plan",
    status_code=status.HTTP_201_CREATED,
    response_model=DetailSchema,
    responses={
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal Server Error"
        }
    }
)
def create_plan(
    request_payload: PlanRequestSchema,
    db: Session = Depends(get_db),
    # authorization: str = Depends(bearer)
) -> Any:
    # token = authorization.credentials
    # _ = decode_token(token=token)
    return plan_service.create_plan(request_payload=request_payload, db=db)
