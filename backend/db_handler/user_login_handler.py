from backend.db_handler.base_handler import BaseDBHandler
from backend.models.user_login import Users


class UserLoginDBHandler(BaseDBHandler):
    def __init__(self):
        super().__init__(model=Users)


user_login_db_handler = UserLoginDBHandler()
