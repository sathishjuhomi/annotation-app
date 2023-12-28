from typing import List
from pydantic import BaseModel


class RenameProjectRequestSchema(BaseModel):
    project_name: str


class ProjectRequestSchema(RenameProjectRequestSchema):
    project_type: str
    label: List[str]
