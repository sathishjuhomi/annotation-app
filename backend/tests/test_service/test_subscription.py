import unittest
from unittest import mock
from unittest.mock import MagicMock, patch

from annotation.backend.db_handler.subscription_handler import subscription_db_handler
from annotation.backend.models.user import Users
from annotation.backend.service.subscription import SubscriptionService
from fastapi import HTTPException, status
from sqlalchemy.orm import Session


class TestStripeService(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()

    @patch("annotation.backend.service.stripe.stripe.Subscription.delete")
    @patch("annotation.backend.db_handler.subscription_handler.subscription_db_handler.load_by_column")
    @patch("annotation.backend.db_handler.subscription_handler.subscription_db_handler.update")
    def test_cancel_subscription_success(self, mock_update, mock_load_by_column, mock_subscription_delete):
        # Mocking data
        subscription_id = "test_subscription_id"
        decoded_token = {"email": "test@example.com"}
        user_email = "test@example.com"
        is_active = True

        mock_subscription_data = mock.Mock(
            subscription_id=subscription_id,
            user=mock.Mock(email="test@example.com"),
            is_active=is_active,
        )
        mock_load_by_column.return_value = mock_subscription_data

        # Set up the mock for Stripe API call
        mock_subscription_delete.return_value = None

        # Create an instance of the service
        stripe_service = SubscriptionService()

        # Call the method
        result = stripe_service.cancel_subscription(
            subscription_id, decoded_token, self.db)

        # Assert the expected behavior
        mock_subscription_delete.assert_called_once_with(subscription_id)
        mock_update.assert_called_once_with(
            db=self.db, db_obj=mock_subscription_data, input_object={"is_active": False})
        self.assertEqual(
            result, {"detail": "Your subscription has been successfully cancelled"})

    @patch("annotation.backend.db_handler.subscription_handler.subscription_db_handler.load_by_column")
    def test_cancel_subscription_invalid_user(self, mock_load_by_column):
        # Mocking data
        subscription_id = "test_subscription_id"
        decoded_token = {"email": "invalid@example.com"}
        user_email = "test@example.com"
        is_active = True

        mock_subscription_data = mock.Mock(
            subscription_id=subscription_id,
            user=mock.Mock(email=user_email),
            is_active=is_active,
        )
        mock_load_by_column.return_value = mock_subscription_data

        # Create an instance of the service
        stripe_service = SubscriptionService()

        # Call the method and expect an HTTPException
        with self.assertRaises(HTTPException) as context:
            stripe_service.cancel_subscription(
                subscription_id, decoded_token, self.db)

        # Assert the expected HTTPException behavior
        self.assertEqual(context.exception.status_code,
                         status.HTTP_403_FORBIDDEN)
        self.assertEqual(str(context.exception.detail),
                         "Only subscriber can cancel the subscription")

    @patch("annotation.backend.db_handler.subscription_handler.subscription_db_handler.load_by_column")
    def test_cancel_subscription_inactive_subscription(self, mock_load_by_column):
        # Mocking data
        subscription_id = "test_subscription_id"
        decoded_token = {"email": "test@example.com"}
        user_email = "test@example.com"
        is_active = False

        mock_subscription_data = mock.Mock(
            subscription_id=subscription_id,
            user=mock.Mock(email=user_email),
            is_active=is_active,
        )
        mock_load_by_column.return_value = mock_subscription_data

        # Create an instance of the service
        stripe_service = SubscriptionService()

        # Call the method and expect an HTTPException
        with self.assertRaises(HTTPException) as context:
            stripe_service.cancel_subscription(
                subscription_id, decoded_token, self.db)

        # Assert the expected HTTPException behavior
        self.assertEqual(context.exception.status_code,
                         status.HTTP_403_FORBIDDEN)
        self.assertEqual(str(context.exception.detail),
                         "Subscription is already Inactive")


if __name__ == "__main__":
    unittest.main()
