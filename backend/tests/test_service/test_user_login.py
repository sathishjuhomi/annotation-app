import unittest
from unittest.mock import Mock, patch

from backend.models.user_login import UserLogin
from backend.schemas.user_login import SignUpSchema, ResetPasswordSchema
from backend.service.user_login import UserLoginService


class TestUserLoginService(unittest.TestCase):
    def setUp(self):
        self.db = Mock()

    @patch("backend.service.user_login.generate_salt", return_value="mock_salt")
    @patch("backend.service.user_login.hash_password", return_value="mock_hash")
    @patch("backend.service.user_login.user_login_db_handler.create",
           return_value=UserLogin(id="123e4567-e89b-12d3-a456-426655440000"))
    def test_create_user(self, *args):
        request_payload = SignUpSchema(
            email="test@example.com",
            password="password123",
        )
        result = UserLoginService.create_user(request_payload, self.db)
        self.assertIsInstance(result, UserLogin)
        self.assertEqual(result.id, "123e4567-e89b-12d3-a456-426655440000")

    @patch("backend.service.user_login.verify_password", return_value=True)
    def test_validate_password_success(self, *args):
        request_payload = SignUpSchema(
            email="test@example.com",
            password="password123",
        )
        mock_user = UserLogin(
            password_salt="mock_salt",
            password_hash="mock_hash"
        )
        result = UserLoginService.validate_password(request_payload, mock_user)
        self.assertTrue(result)

    @patch("backend.service.user_login.verify_password", return_value=False)
    def test_validate_password_error(self, *args):
        request_payload = SignUpSchema(
            email="test@example.com",
            password="password123",
        )
        mock_user = UserLogin(
            password_salt="mock_salt",
            password_hash="mock_hash"
        )
        result = UserLoginService.validate_password(request_payload, mock_user)
        self.assertFalse(result)

    @patch("backend.service.user_login.hash_password", return_value="mock_new_hash")
    @patch("backend.service.user_login.user_login_db_handler.update", return_value=None)
    def test_update_password(self, *args):
        request_payload = ResetPasswordSchema(
            new_password="new_password123"
        )
        mock_user = UserLogin(
            id="123e4567-e89b-12d3-a456-426655440000",
            password_salt="mock_salt"
        )
        self.assertIsNone(
            UserLoginService.update_password(request_payload, mock_user, self.db)
        )

    @patch("backend.service.user_login.create_access_token", return_value="mock_token")
    def test_generate_access_token(self, *args):
        mock_user = UserLogin(
            email="test@example.com",
            id="123e4567-e89b-12d3-a456-426655440000"
        )
        result = UserLoginService.generate_access_token(mock_user)
        self.assertEqual(result, "mock_token")
