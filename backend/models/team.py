from sqlalchemy import Column, String, Integer, TIMESTAMP, text, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.models.database import Base
from backend.models.timestamp_mixin import TimestampMixIn


class Teams(Base, TimestampMixIn):
    __tablename__ = "teams"

    id = Column(UUID(as_uuid=True), primary_key=True)
    team_name = Column(String, nullable=False)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("Users")

    __table_args__ = (UniqueConstraint("team_name", name="team_name_key"),)
