from annotation.backend.service.team import TeamService
from annotation.backend.schemas.request.team import TeamSchema
from annotation.backend.models.team import Teams
from unittest.mock import Mock, patch
import unittest

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdGhpc2hrQGp1aG9taS5jb20iLCJpZCI6IjcyOWY3OWY0LTU5ZGYtNGQ3Yy04ZTk4LTFmY2EwYTI1Y2MyYyIsImV4cCI6MTY5NTM3Njc3Nn0._thXMjkoxDKPiQN0fJI190eJ9YtFurNq15PKjkW_pSY"
TEAM_ID = "e52ac1f7-72f4-48bf-9e37-4f87c6b91514"
USER_ID = "729f79f4-59df-4d7c-8e98-1fca0a25cc2c"


class TestTeamService(unittest.TestCase):
    def setUp(self):
        self.db = Mock()

    @patch("annotation.backend.service.team.get_user_detail", return_value=Mock(email="sathishk@juhomi.com", id=USER_ID))
    @patch("uuid.uuid4", return_value=TEAM_ID)
    @patch("annotation.backend.db_handler.team_handler.team_db_handler.create", return_value=Teams(id=TEAM_ID))
    @patch("annotation.backend.db_handler.team_member_handler.team_member_db_handler.load_all_by_column", return_value=None)
    def test_create_team(self, *args):
        request_payload = TeamSchema(team_name="Test Team")
        mock_token = TOKEN

        team_service = TeamService()
        created_team, creator_email = team_service.create_team(
            mock_token, request_payload, self.db)

        self.assertIsInstance(created_team, Teams)
        self.assertEqual(creator_email, "sathishk@juhomi.com")
        self.assertEqual(created_team.id, TEAM_ID)

    @patch("annotation.backend.service.team.get_user_detail", return_value=Mock(email="sathishk@juhomi.com", id=USER_ID))
    @patch("annotation.backend.db_handler.team_handler.team_db_handler.update", return_value=Teams(id=TEAM_ID, team_name="Updated Team"))
    def test_update_team(self, *args):
        request_payload = TeamSchema(team_name="Updated Team")
        mock_team = Teams(id=TEAM_ID, team_name="Original Team")
        mock_token = TOKEN

        team_service = TeamService()
        updated_team = team_service.update_team(
            mock_token, request_payload, mock_team, self.db)

        self.assertIsInstance(updated_team, Teams)
        self.assertEqual(updated_team.team_name, "Updated Team")
