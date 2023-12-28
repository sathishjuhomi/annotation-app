from typing import List
from pydantic import BaseModel


class ProjectRequestSchema(BaseModel):
    project_name: str
    project_type: str
    label: List[str]
