import unittest
from unittest.mock import MagicMock
from unittest.mock import Mock, patch
from backend.service.team import team_service
from backend.schemas.request.team import TeamSchema

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdGhpc2hrQGp1aG9taS5jb20iLCJpZCI6IjcyOWY3OWY0LTU5ZGYtNGQ3Yy04ZTk4LTFmY2EwYTI1Y2MyYyIsImV4cCI6MTY5NTM3Njc3Nn0._thXMjkoxDKPiQN0fJI190eJ9YtFurNq15PKjkW_pSY"
team_id = "e52ac1f7-72f4-48bf-9e37-4f87c6b91514"
user_id = "729f79f4-59df-4d7c-8e98-1fca0a25cc2c"


class TestTeamService(unittest.TestCase):
    def setUp(self):
        self.team_service = team_service()

    @patch("backend.service.user.create_access_token", return_value="mock_token")
    @patch('backend.service.team.get_user_id')
    @patch('uuid.uuid4')
    @patch('backend.db_handler.team_handler.team_db_handler.create')
    def test_create_team(self, mock_create, mock_uuid4, mock_get_user_id):
        mock_db = MagicMock()
        mock_request_payload = TeamSchema(team_name="Test Team", token=token)
        mock_uuid4.return_value = team_id
        mock_get_user_id.return_value = user_id

        result = self.team_service.create_team(mock_request_payload, mock_db)

        self.assertEqual(result['id'], team_id)
        self.assertEqual(result['team_name'], "Test Team")
        self.assertEqual(result['created_by'], user_id)

        