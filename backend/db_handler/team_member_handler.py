from annotation.backend.db_handler.base_handler import BaseDBHandler
from annotation.backend.models.team_member import TeamMembers


class TeamMemberDBHandler(BaseDBHandler):
    def __init__(self):
        super().__init__(model=TeamMembers)


team_member_db_handler = TeamMemberDBHandler()
