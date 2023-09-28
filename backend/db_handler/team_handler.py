from backend.db_handler.base_handler import BaseDBHandler
from backend.models.team import Teams


class TeamDBHandler(BaseDBHandler):
    def __init__(self):
        super().__init__(model=Teams)


team_db_handler = TeamDBHandler()
