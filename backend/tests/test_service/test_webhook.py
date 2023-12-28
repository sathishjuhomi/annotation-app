from unittest.mock import MagicMock, patch, Mock
import unittest
from annotation.backend.service.webhook import webhook_service
from fastapi import HTTPException

email = "test@maverick.com"
subscription_id = "sub_1OATbjSEc6wEphSVhYfeaPKy"
price_id = "price_1OADsBSEc6wEphSVxcr8Lj27"

class WebhookServiceTest(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()

    # @patch("")
    # @patch("annotation.backend.db_handler.user_db_handler.load_by_column")
    def test_create_subscription_missing_email(self,
        #   mock_user_load_by_column,
    ):
        
        mock_email = None
        mock_subscription_id = subscription_id
        mock_subscription = {
            "subscription_id": subscription_id
        }
        mock_price_id = price_id

        mock_address = {
            "address": {"city":"chennai"}
        }

        mock_session = {
            "customer_details": {"email": "johndoe@example.com"},
            "subscription": "sub_123456789",
            "payment_status": "paid"
        }

        user = Mock(email=email, is_active=True)

        mock_db_responses = [user]

        # mock_user_load_by_column.return_value = mock_db_responses

        # Call the `create_subscription` method
        with self.assertRaises(HTTPException) as e:
            webhook_service.create_subscription(session=mock_session, db=self.db)

        self.assertEqual(e.detail, "Missing required details to update database")
        
if __name__ == "__main__":
    unittest.main()