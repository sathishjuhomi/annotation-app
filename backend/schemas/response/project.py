from typing import List
from pydantic import BaseModel, UUID4
from datetime import datetime


class ProjectResponseSchema(BaseModel):
    id: UUID4
    project_name: str
    project_type: str
    t_create: datetime | None
    t_update: datetime | None