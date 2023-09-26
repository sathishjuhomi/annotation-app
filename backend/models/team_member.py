from sqlalchemy import Column, TIMESTAMP, text, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from backend.models.database import Base


class TeamMembers(Base):
    __tablename__ = "team_members"

    id = Column(UUID(as_uuid=True), primary_key=True)
    team_id = Column(UUID(as_uuid=True), ForeignKey(
        "teams.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=True)
    invited_by_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=True)
    roles = Column(JSON, nullable=False)
    activated = Column(Boolean, default=False)
    declined = Column(Boolean, default=False)
    t_create = Column(
        TIMESTAMP(timezone=True), nullable=False, server_default=text("now()")
    )
    t_update = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("now()"),
        onupdate=text("now()"),
    )
    t_delete = Column(TIMESTAMP(timezone=True))
    # Define relationships to Users and Teams with foreign keys
    user = relationship("Users", foreign_keys=[user_id])
    team = relationship("Teams", foreign_keys=[team_id])
    invited_by = relationship("Users", foreign_keys=[invited_by_id])
