from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from annotation.backend.models.database import Base
from annotation.backend.models.timestamp_mixin import TimestampMixIn


class Subscription(Base, TimestampMixIn):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id"), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey(
        "teams.id"), nullable=False)
    # for one time payment we don't get subscription id
    subscription_id = Column(String, nullable=True)
    price_id = Column(String, ForeignKey('plans.price_id'), nullable=False)
    payment_status = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    user = relationship("Users")
    plan = relationship("Plan")
    team = relationship("Teams")
