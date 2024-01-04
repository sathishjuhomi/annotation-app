from typing import List
from pydantic import BaseModel


class ImageUploadRequestSchema(BaseModel):
    images_path: List[str]
