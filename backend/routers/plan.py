from typing import Any, List
from pydantic import UUID4
from backend.schemas.request.plan import PlanRequestSchema, UpdatePlanSchema, UpdatePriceSchema
from backend.schemas.response.plan import PlanResponseSchema
from backend.schemas.response.user import DetailSchema
from backend.service.plan import plan_service
from fastapi.security import HTTPBearer
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.models.database import get_db


plan_router = APIRouter(prefix="/api/v1", tags=["Plans"])


bearer = HTTPBearer()


@plan_router.post(
    "/plans",
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
    # print('inside plan')
    # token = authorization.credentials
    # print('token', token)
    # _ = decode_token(token=token)
    return plan_service.create_plan(request_payload=request_payload, db=db)


@plan_router.get(
    "/plans",
    description="This API will get all the Plans",
    response_model=List[PlanResponseSchema],
    responses={
        status.HTTP_200_OK: {
            "description": "Successfully retrived all the plans"
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal Server Error"
        }
    }
)
def get_plans(
    db: Session = Depends(get_db)
):
    return plan_service.get_all_plans(db)


@plan_router.patch(
    "/plans/{id}",
    description="This API will allow owner to update their plan name",
    response_model=DetailSchema,
    responses={
        status.HTTP_200_OK: {
            "description": "Successfully updated the plan name, description"
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal Server Error"
        }
    }
)
def update_plan(
    id: UUID4,
    request_payload: UpdatePlanSchema,
    db: Session = Depends(get_db)
):
    return plan_service.update_plan(id, request_payload, db)


@plan_router.patch(
    "/plans/price/{price_id}",
    description="This API will allow owner to update the price for their plan",
    response_model=DetailSchema,
    responses={
        status.HTTP_200_OK: {
            "description": "Successfully updated the price"
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal Server Error"
        }
    }
)
def update_price(
    price_id: str,
    request_payload: UpdatePriceSchema,
    db: Session = Depends(get_db)
):
    return plan_service.update_price(price_id, request_payload, db)
