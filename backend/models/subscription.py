from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from backend.models.database import Base
from backend.models.timestamp_mixin import TimestampMixIn


class Subscription(Base, TimestampMixIn):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id"), nullable=False)
    subscription_id = Column(String, nullable=False)
    price_id = Column(String, ForeignKey('plans.price_id'), nullable=False)
    payment_status = Column(String, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    user = relationship("Users")
    plan = relationship("Plan")
