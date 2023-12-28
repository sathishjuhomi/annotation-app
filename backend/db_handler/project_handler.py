from backend.db_handler.base_handler import BaseDBHandler
from backend.models.project import Project


class ProjectDBHandler(BaseDBHandler):
    def __init__(self):
        super().__init__(model=Project)


project_db_handler = ProjectDBHandler()