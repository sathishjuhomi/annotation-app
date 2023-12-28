from sqlalchemy import Column, String, Integer, Float, Enum, Boolean
from sqlalchemy.dialects.postgresql import UUID

from annotation.backend.models.database import Base
from annotation.backend.models.timestamp_mixin import TimestampMixIn


class Plan(Base, TimestampMixIn):
    __tablename__ = 'plans'

    id = Column(UUID(as_uuid=True), primary_key=True)
    plan_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    price_id = Column(String, nullable=False, unique=True)
    currency = Column(String(3), nullable=False)
    payment_mode = Column(String, nullable=False, default="card")
    payment_type = Column(
        Enum('recurring', 'one_time', name='payment_type_enum'))
    billing_period = Column(
        Enum('month', 'year', 'week', 'day', name='billing_period_enum'), nullable=True)
    interval_count = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_by_id = Column(UUID(as_uuid=True), nullable=True)
