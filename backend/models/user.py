from sqlalchemy import Column, String, UniqueConstraint, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID

from backend.models.database import Base
from backend.models.timestamp_mixin import TimestampMixIn


class Users(Base, TimestampMixIn):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    password_salt = Column(String, nullable=False)
    address = Column(JSON, nullable=True)
    admin = Column(Boolean, default=False)

    __table_args__ = (UniqueConstraint("email", name="user_login_email_key"),)
