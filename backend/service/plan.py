import stripe
import uuid
from pydantic import UUID4
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.request.plan import PlanRequestSchema, UpdatePlanSchema, UpdatePriceSchema
from backend.schemas.response.plan import PlanResponseSchema
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
    def map_db_responses_to_schemas(db_responses):
        schemas = []
        for db_response in db_responses:
            schema = PlanResponseSchema(
                id=db_response['id'],
                plan=UpdatePlanSchema(
                    plan_name=db_response['plan_name'],
                    description=db_response['description']
                ),
                price=UpdatePriceSchema(
                    price=db_response['price'],
                    currency=db_response['currency'],
                    payment_mode=db_response['payment_mode'],
                    payment_type=db_response['payment_type'],
                    billing_period=db_response['billing_period'],
                    interval_count=db_response['interval_count']
                )
            )
            schemas.append(schema)
        return schemas

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
    def update_product_price(price_id: str, plan_price: dict) -> dict:
        try:
            amount = int(plan_price["price"])*100
            updated_price = stripe.Price.modify(
                price_id,
                price=amount,
                currency=plan_price["currency"],
                type=plan_price["payment_type"],
                interval=plan_price["billing_period"],
                interval_count=plan_price["interval_count"]
            )
            return updated_price
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update the price: {str(e)}"
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

    def get_all_plans(self, db: Session):
        response = plan_db_handler.load_all_by_column(
            db=db,
            column_name="is_deleted",
            value=False
        )
        db_responses = [row.__dict__ for row in response]
        return self.map_db_responses_to_schemas(db_responses=db_responses)

    def create_plan(
            self,
            request_payload: PlanRequestSchema,
            db: Session
    ) -> dict:
        plan_data = request_payload.model_dump()
        plan_data["plan"]["id"] = uuid.uuid4()
        product = self.create_product(plan_data["plan"])
        price = self.create_price(plan_data["price"], product)
        plan_data["price"]['price_id'] = price.id
        merged_dict = {key: value for subdict in plan_data.values()
                       for key, value in subdict.items()}
        plan_db_handler.create(db, input_object=merged_dict)
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
        plan_obj = plan_db_handler.load_by_id(db=db, id=id)
        plan_db_handler.update(
            db=db,
            db_obj=plan_obj,
            input_object=input_obj
        )
        return {"detail": "Plan updated successfully"}

    def update_price(
            self,
            price_id: str,
            request_payload: UpdatePriceSchema,
            db: Session
    ) -> dict:
        price = request_payload.model_dump()
        updated_price = self.update_product_price(
            price_id=price_id,
            plan_price=price
        )
        input_obj = {
            "price": updated_price["price"],
            "currency": updated_price["currency"],
            "payment_type": updated_price["type"],
            "billing_period": updated_price["interval"],
            "interval_count": updated_price["interval_count"]
        }
        price_obj = plan_db_handler.load_by_id(db=db, id=price_id)
        plan_db_handler.update(
            db=db,
            db_obj=price_obj,
            input_object=input_obj
        )
        return {"detail": "Price updated successfully"}


plan_service = PlanService()
