from sqlalchemy import Column, String, UniqueConstraint, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from backend.models.database import Base
from backend.models.timestamp_mixin import TimestampMixIn


class Project(Base, TimestampMixIn):
    __tablename__ = 'projects'

    id = Column(UUID(as_uuid=True), primary_key=True)
    project_name = Column(String, nullable=False)
    project_type = Column(
        Enum('object detection', 'classification', 'instance segmentation', name='project_type_enum')
    )
    label = Column(ARRAY(String), nullable=True)
    team_id = Column(UUID(as_uuid=True), ForeignKey(
        "teams.id", ondelete="CASCADE"), nullable=False)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False)
    updated_by_id = Column(UUID(as_uuid=True), nullable=True)
    user = relationship("Users")
    team = relationship("Teams", foreign_keys=[team_id])

    __table_args__ = (UniqueConstraint("project_name", name="project_name_key"),)
