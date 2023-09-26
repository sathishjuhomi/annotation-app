import unittest
from unittest.mock import MagicMock
from unittest.mock import Mock, patch
from backend.service.team import team_service
from backend.schemas.request.team import TeamSchema

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdGhpc2hrQGp1aG9taS5jb20iLCJpZCI6IjcyOWY3OWY0LTU5ZGYtNGQ3Yy04ZTk4LTFmY2EwYTI1Y2MyYyIsImV4cCI6MTY5NTM3Njc3Nn0._thXMjkoxDKPiQN0fJI190eJ9YtFurNq15PKjkW_pSY"
TEAM_ID = "e52ac1f7-72f4-48bf-9e37-4f87c6b91514"
USER_ID = "729f79f4-59df-4d7c-8e98-1fca0a25cc2c"


class TestTeamService(unittest.TestCase):
    def setUp(self):
        self.team_service = team_service()

    @patch("backend.service.user.create_access_token", return_value="mock_token")
    @patch('backend.service.team.get_user_id')
    @patch('uuid.uuid4')
    @patch('backend.db_handler.team_handler.team_db_handler.create')
    def test_create_team(self, mock_create, mock_uuid4, mock_get_user_id, mock_access_token):
        mock_db = MagicMock()
        mock_request_payload = TeamSchema(team_name="Test Team", token=TOKEN)
        mock_uuid4.return_value = TEAM_ID
        mock_get_user_id.return_value = USER_ID

        result = self.team_service.create_team(mock_request_payload, mock_db)

        self.assertEqual(result['id'], TEAM_ID)
        self.assertEqual(result['team_name'], "Test Team")
        self.assertEqual(result['created_by'], USER_ID)

    @patch("backend.service.user.create_access_token", return_value="mock_token")
    @patch('backend.service.team.get_user_id')
    @patch('backend.db_handler.team_handler.team_db_handler.update')
    def test_update_team(self, mock_update, mock_get_user_id, mock_create_access_token):
        mock_db = MagicMock()
        mock_request_payload = TeamSchema(team_name="Test Team", token=TOKEN)
        mock_get_user_id.return_value = USER_ID

        result = self.team_service.update_team(mock_request_payload, mock_db)

        self.assertEqual(result['id'], TEAM_ID)
        self.assertEqual(result['team_name'], "Test Team")
        self.assertEqual(result['created_by'], USER_ID)
