import unittest
from datetime import timedelta
from unittest.mock import patch

from jose import jwt

from backend.utils.utils import (
    hash_password,
    verify_password,
    generate_salt,
    create_access_token,
    generate_password_reset_token,
    verify_password_reset_token,
)


class TestUtils(unittest.TestCase):
    def test_hash_password(self):
        password = "test_password"
        hashed_password = hash_password(password)
        self.assertTrue(hashed_password.startswith("$2b$"))

    def test_verify_password_correct(self):
        password = "test_password"
        hashed_password = hash_password(password)
        self.assertTrue(verify_password(password, hashed_password))

    def test_verify_password_incorrect(self):
        password = "test_password"
        incorrect_password = "wrong_password"
        hashed_password = hash_password(password)
        self.assertFalse(verify_password(incorrect_password, hashed_password))

    def test_generate_salt(self):
        salt = generate_salt()
        self.assertEqual(len(salt), 32)

    @patch("backend.utils.utils.jwt.encode", return_value="mock_token")
    def test_create_access_token(self, *args):
        data = {"user_id": 123}
        expires_delta = timedelta(minutes=15)
        token = create_access_token(data, expires_delta)
        self.assertEqual(token, "mock_token")

    @patch("backend.utils.utils.create_access_token", return_value="mock_reset_token")
    def test_generate_password_reset_token(self, *args):
        email = "test@example.com"
        token = generate_password_reset_token(email)
        self.assertEqual(token, "mock_reset_token")

    @patch("backend.utils.utils.jwt.decode", return_value={"email": "test@example.com"})
    def test_verify_password_reset_token_valid(self, *args):
        token = "valid_reset_token"
        email = verify_password_reset_token(token)
        self.assertEqual(email, "test@example.com")

    @patch("backend.utils.utils.jwt.decode", side_effect=jwt.JWTError("Invalid token"))
    def test_verify_password_reset_token_invalid(self, *args):
        token = "invalid_reset_token"
        email = verify_password_reset_token(token)
        self.assertIsNone(email)
