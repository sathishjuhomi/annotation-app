from sqlalchemy import TIMESTAMP, Column, String, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID

from backend.models.database import Base
from backend.models.timestamp_mixin import TimestampMixIn


class Users(Base, TimestampMixIn):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    password_salt = Column(String, nullable=False)

    __table_args__ = (UniqueConstraint("email", name="user_email_key"),)
