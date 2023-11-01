import stripe
import uuid
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.schemas.request.plan import PlanRequestSchema
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
    def create_plan(
            request_payload: PlanRequestSchema,
            db: Session):
        plan_data = request_payload.model_dump()
        plan_data["id"] = uuid.uuid4()
        try:
            product = stripe.Product.create(
                name=plan_data["plan_name"],
                description=plan_data["description"]
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create product: {str(e)}"
            )

        try:
            if product:
                if plan_data['payment_type'] == 'recurring':
                    billing_period = plan_data['billing_period']
                    interval_count = plan_data['interval_count']
                    # Create a price plan (subscription)
                    price = stripe.Price.create(
                        unit_amount=(int(plan_data["price"]))*100,
                        currency=plan_data["currency"],
                        recurring={"interval": billing_period,
                                   "interval_count": interval_count},
                        product=product.id,  # Use the product ID from the previous step
                    )
                else:
                    # Create a price plan (subscription)
                    price = stripe.Price.create(
                        unit_amount=(int(plan_data["price"]))*100,
                        currency=plan_data["currency"],
                        product=product.id,  # Use the product ID from the previous step
                    )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create price plan: {str(e)}"
            )
        plan_data['price_id'] = price.id
        plan_db_handler.create(db, input_object=plan_data)
        return {"detail": "Plan created successfully"}

plan_service = PlanService()