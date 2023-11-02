import stripe
import uuid
from pydantic import UUID4
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.request.plan import PlanRequestSchema, UpdatePlanSchema
from backend.db_handler.plan_handler import plan_db_handler
from backend.config import get_settings

settings = get_settings()

# Check if STRIPE_SECRET_KEY is defined
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY
else:
    raise ValueError("STRIPE_SECRET_KEY is not defined in the configuration.")


class PlanService():
    @staticmethod
    def create_product(plan_data: dict) -> dict:
        try:
            product = stripe.Product.create(
                id=plan_data["id"],
                name=plan_data["plan_name"],
                description=plan_data["description"]
            )
            return product
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create product: {str(e)}"
            )

    @staticmethod
    def update_product(id: UUID4, plan: dict) -> dict:
        try:
            updated_product = stripe.Product.modify(
                str(id),
                name=plan["plan_name"],
                description=plan["description"]
            )
            return updated_product
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update the product: {str(e)}"
            )

    @staticmethod
    def create_price(plan_data: dict, product: dict) -> dict:
        try:
            amount = int(plan_data["price"]) * 100
            price_params = {
                "unit_amount": amount,
                "currency": plan_data["currency"],
                "product": product.id,
            }

            if plan_data['payment_type'] == 'recurring':
                price_params["recurring"] = {
                    "interval": plan_data['billing_period'],
                    "interval_count": plan_data['interval_count'],
                }

            price = stripe.Price.create(**price_params)
            return price

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create price plan: {str(e)}"
            )

    def create_plan(
            self,
            request_payload: PlanRequestSchema,
            db: Session
    ) -> dict:
        plan_data = request_payload.model_dump()
        plan_data["id"] = uuid.uuid4()
        product = self.create_product(plan_data)
        price = self.create_price(plan_data, product)
        plan_data['price_id'] = price.id
        plan_db_handler.create(db, input_object=plan_data)
        return {"detail": "Plan created successfully"}

    def update_plan(
            self,
            id: UUID4,
            request_payload: UpdatePlanSchema,
            db: Session
    ) -> dict:
        plan = request_payload.model_dump()
        updated_plan = self.update_product(id, plan)
        input_obj = {
            "plan_name": updated_plan["name"],
            "description": updated_plan["description"]
        }
        plan = plan_db_handler.load_by_id(db=db, id=id)
        plan_db_handler.update(
            db=db,
            db_obj=plan,
            input_object=input_obj
        )
        return {"detail": "Plan updated successfully"}


plan_service = PlanService()
