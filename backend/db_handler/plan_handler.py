from backend.db_handler.base_handler import BaseDBHandler
from backend.models.plan import Plan


class PlanDBHandler(BaseDBHandler):
    def __init__(self):
        super().__init__(model=Plan)


plan_db_handler = PlanDBHandler()
