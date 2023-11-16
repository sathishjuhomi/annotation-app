from backend.service.team_member import team_member_service
from backend.schemas.request.team_member import TeamMemberSchema
from backend.models.team_member import TeamsMembers
from unittest.mock import MagicMock, patch
import unittest
import uuid
from sqlalchemy.orm import Session

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdGhpc2hrQGp1aG9taS5jb20iLCJpZCI6ImMyMGMyYmNmLTA5YjQtNDEyYy1iZmRkLWJmNTZlNWNkNDcyNCIsImV4cCI6MTY5NjMxNjg2OH0.IWRm5Ug_2GDuJTaWwtDv83ef8Hg0WU6vhPGWDmlv-7M"
TEAM_ID = "8e5f3ccb-4131-4a0a-8ff2-4939b951ad3f"


class TestTeamMemberService(unittest.TestCase):
    def setUp(self):
        self.db = MagicMock()
    
    @patch('backend.services.team_member.create_access_token')
    @patch('backend.services.team_member.send_invitation_email')
    @patch('backend.services.team_member.team_member_db_handler')
    @patch('backend.services.team_member.get_user_detail')
    def test_email_invitation(self, mock_get_user_detail, mock_team_member_db_handler,
                              mock_send_invitation_email, mock_create_access_token):
        db_mock = MagicMock(spec=Session)


        # Mock database and token-related functions
        mock_team_member_db_handler.load_by_column.return_value = {"roles": {"admin": True}}
        mock_get_user_detail.return_value = {"email": "inviter@example.com"}

        # Act
        team_id = uuid.uuid4()
        request_payload = MagicMock(model_dump=lambda: {"email": "invitee@example.com", "role": {"admin": False}})
        result = team_member_service.email_invitation(team_id, "fake_token", request_payload, db_mock)

        # Assert
        self.assertIn("detail", result)
        self.assertIn("invited successfully", result["detail"])