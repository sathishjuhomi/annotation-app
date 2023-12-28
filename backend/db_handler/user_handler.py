from annotation.backend.db_handler.base_handler import BaseDBHandler
from annotation.backend.models.user import Users


class UserDBHandler(BaseDBHandler):
    def __init__(self):
        super().__init__(model=Users)


user_db_handler = UserDBHandler()
