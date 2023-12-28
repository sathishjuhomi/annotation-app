from annotation.backend.db_handler.base_handler import BaseDBHandler
from annotation.backend.models.project import Project


class ProjectDBHandler(BaseDBHandler):
    def __init__(self):
        super().__init__(model=Project)


project_db_handler = ProjectDBHandler()