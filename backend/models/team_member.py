from sqlalchemy import Column, ForeignKey, Boolean, UniqueConstraint, String
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from backend.models.database import Base
from backend.models.timestamp_mixin import TimestampMixIn


class TeamMembers(Base, TimestampMixIn):
    __tablename__ = "team_members"

    id = Column(UUID(as_uuid=True), primary_key=True)
    team_id = Column(UUID(as_uuid=True), ForeignKey(
        "teams.id", ondelete="CASCADE"), nullable=False)
    email = Column(String, nullable=False)
    invited_by_id = Column(UUID(as_uuid=True), nullable=True)
    invite_token = Column(String, nullable=True)
    roles = Column(JSON, nullable=False)
    is_activated = Column(Boolean, default=False)
    is_declined = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_by_id = Column(UUID(as_uuid=True), nullable=True)
    # Define relationships to Users and Teams with foreign keys
    team = relationship("Teams", foreign_keys=[team_id])

    # Define a unique constraint for team_id and email
    __table_args__ = (
        UniqueConstraint('team_id', 'email', name='team_id_email_key'),
    )
