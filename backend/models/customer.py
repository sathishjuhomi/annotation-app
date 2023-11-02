from sqlalchemy import Column, String, JSON, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


from backend.models.database import Base
from backend.models.timestamp_mixin import TimestampMixIn


class Customer(Base, TimestampMixIn):
    __tablename__ = "customers"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id"), nullable=False)
    customer_id = Column(String, nullable=False)
    customer_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    address = Column(JSON, nullable=False)
    payment_status = Column(String, nullable=False)
    price_id = Column(String, ForeignKey('plans.price_id'), nullable=True)
    subscription_id = Column(String, nullable=True)
    invoice_id = Column(String, nullable=True)
    is_active = Column(Boolean, default=False, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_by_id = Column(UUID(as_uuid=True), nullable=True)

    user = relationship("Users")
    plan = relationship("Plan")
