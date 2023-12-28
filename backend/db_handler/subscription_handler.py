from annotation.backend.db_handler.base_handler import BaseDBHandler
from annotation.backend.models.subscription import Subscription


class SubscriptionDBHandler(BaseDBHandler):
    def __init__(self):
        super().__init__(model=Subscription)


subscription_db_handler = SubscriptionDBHandler()