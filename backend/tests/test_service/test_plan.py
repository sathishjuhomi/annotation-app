import unittest
from unittest.mock import MagicMock, Mock, patch

from backend.schemas.request.plan import PlanRequestSchema, UpdatePlanSchema, UpdatePriceSchema
from backend.schemas.response.plan import PlanResponseSchema
from backend.service.plan import PlanService

product_id = '1dee9072-bacf-4e98-b1c0-479e34450717'
amount_id = 'price_1O8L6PSEc6wEphSVt7U09UMz'


class TestPlanService(unittest.TestCase):
    def setUp(self):
        self.db = Mock()

    @patch("backend.service.plan.stripe.Product.create", return_value=Mock(return_value=dict()))
    def test_create_product(self, mock_stripe_product_create):
        plan_data = {
            "id": product_id,
            "plan_name": "Test Plan",
            "description": "Test Description"
        }

        mock_stripe_product_create.return_value = {"id": product_id}

        result = PlanService.create_product(plan_data)

        self.assertEqual(result, {"id": product_id})

    @patch("backend.service.plan.stripe.Product.modify", return_value=Mock(return_value=dict()))
    def test_update_product(self, mock_stripe_product_modify):
        prod_id = product_id
        plan = {
            "plan_name": "Updated Plan Name",
            "description": "Updated Plan Description"
        }

        mock_stripe_product_modify.return_value = {"id": prod_id}

        result = PlanService.update_product(prod_id, plan=plan)

        print('result ', result)

        self.assertEqual(result, {"id": prod_id})

    @patch("backend.service.plan.stripe.Price.modify", return_value=Mock(return_value=dict()))
    def test_update_price(self, mock_strip_price_modify):
        price_id = amount_id
        price_state = "False"

        mock_strip_price_modify.return_value = {"id": price_id}

        result = PlanService.update_price(price_id, price_state)

        self.assertEqual(result, {"id": price_id})

    @patch("backend.service.plan.stripe.Price.create", return_value=Mock(return_value=dict()))
    def test_create_price(self, mock_stripe_price_create):
        price_params = {
            "price": 50,
            "currency": "USD",
            "payment_type": "recurring",
            "billing_period": "month",
            "interval_count": 1
        }

        mock_product_id = Mock(id="product_id")
        mock_stripe_price_create.return_value = {"price_id": amount_id}

        result = PlanService.create_price(price_params, mock_product_id)

        self.assertEqual(result, {"price_id": amount_id})

    @patch("backend.db_handler.plan_handler.plan_db_handler.load_all_by_column")
    @patch("backend.service.plan.PlanService.map_db_responses_to_schemas")
    def test_get_all_plans(self, mock_map_db_responses_to_schemas, mock_load_all_by_column):

        plan1 = Mock(id=product_id, price_id=amount_id, is_active=True,
                     plan_name="Test Plan", description="Test Description")

        mock_db_responses = [plan1]

        mock_load_all_by_column.return_value = mock_db_responses
        expected_response = [
            PlanResponseSchema(
                id=product_id,
                price_id=amount_id,
                is_active=True,
                plan=UpdatePlanSchema(
                    plan_name="Test Plan", description="Test Description"),
                price=UpdatePriceSchema(price=50, currency="USD", payment_mode="mode",
                                        payment_type="type", billing_period="month", interval_count=1)
            )
        ]

        mock_load_all_by_column.return_value = mock_db_responses
        mock_map_db_responses_to_schemas.return_value = expected_response

        plan_service = PlanService()

        result = plan_service.get_all_plans(plans=True, db=self.db)

        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 1)
        self.assertIsInstance(result[0], PlanResponseSchema)
        self.assertEqual(str(result[0].id), product_id)
        self.assertEqual(result[0].price_id, amount_id)
        self.assertTrue(result[0].is_active)

    @patch("backend.service.plan.PlanService.create_price")
    @patch("backend.service.plan.PlanService.create_product")
    def test_create_plan(self, mock_create_product, mock_create_price):
        mock_plan_data = PlanRequestSchema(
            plan={
                # "id": "test_id",
                "plan_name": "Test Plan",
                "description": "Test Description",
            },
            price={
                "price": 10.0,
                "currency": "USD",
                "payment_mode": "card",
                "payment_type": "recurring",
                "billing_period": "month",
                "interval_count": 1,
            }
        )
        # mock_plan_data["plan"]["id"] = uuid.uuid4()
        mock_product = Mock(id='product_id')
        mock_price = Mock(id='price_id')

        mock_create_product.return_value = mock_product
        mock_create_price.return_value = mock_price
        plan_service = PlanService()

        result = plan_service.create_plan(
            request_payload=mock_plan_data, db=self.db)

        self.assertEqual(result, {"detail": "Plan created successfully"})

    @patch("backend.db_handler.plan_handler.plan_db_handler.load_by_id")
    @patch("backend.service.plan.PlanService.update_product")
    def test_update_plan(self, mock_update_product, mock_load_by_id):
        mock_plan = UpdatePlanSchema(
            plan_name="Test Plan", description="Test Description")

        # Mock updated plan using MagicMock
        mock_updated_plan = MagicMock(id=product_id,
                                      name="Tested Plan",
                                      description="Plan Description"
                                      )
        mock_update_product.return_value = mock_updated_plan

        # Mock plan object using MagicMock
        mock_plan_obj = MagicMock(id=product_id,
                                  plan_name="Test Plan",
                                  description="Team Description"
                                  )
        mock_load_by_id.return_value = mock_plan_obj

        plan_service = PlanService()
        result = plan_service.update_plan(
            id=product_id, request_payload=mock_plan, db=self.db)

        self.assertEqual(result, {"detail": "Plan updated successfully"})

    @patch("backend.db_handler.plan_handler.plan_db_handler.load_by_column")
    @patch("backend.service.plan.PlanService.update_price")
    def test_update_price_state(self, mock_update_price, mock_load_by_column):
        is_active = False

        mock_updated_price = MagicMock(price_id=amount_id, active=is_active)
        mock_update_price.return_value = mock_updated_price

        mock_plan_obj = MagicMock(price_id=amount_id, active=is_active)
        mock_load_by_column.return_value = mock_plan_obj

        plan_service = PlanService()
        result = plan_service.update_price_state(
            active=is_active, db=self.db, price_id=amount_id)

        expected_result = {
            "detail": f"Plan {'activated' if is_active else 'deactivated'} successfully"}
        self.assertEqual(result, expected_result)


if __name__ == "__main__":
    unittest.main()