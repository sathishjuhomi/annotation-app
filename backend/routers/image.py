from backend.models.database import get_db
from backend.schemas.request.image import ImageUploadRequestSchema
from backend.schemas.response.user import DetailSchema
from backend.service.image import image_service
from backend.utils.utils import decode_token
from pydantic import UUID4
import uuid
from fastapi.security import HTTPBearer
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

image_router = APIRouter(prefix="/api/v1", tags=["images"])

bearer = HTTPBearer()


@image_router.post(
    "teams/{team_id}/projects/{project_id}/upload-images",
    description="This API endpoint allow user to upload an images to the project.",
    response_model=DetailSchema
)
def upload_images(
    request_payload: ImageUploadRequestSchema,
    team_id: UUID4,
    project_id: UUID4,
    authorization: str = Depends(bearer),
    db: Session = Depends(get_db)
):
    token = authorization.credentials
    decoded_token = decode_token(token=token)
    response = image_service.upload_image(request_payload,
                                          team_id,
                                          project_id,
                                          decoded_token,
                                          db)
    return response
