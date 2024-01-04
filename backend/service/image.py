from backend.service.team_member import team_member_service
from sqlalchemy.orm import Session
import os
import shutil
from libcloud.storage.types import Provider
from libcloud.storage.providers import get_driver
from typing import Optional


class ImageService:
    def upload_image(request_payload: list,
                     team_id,
                     project_id,
                     decoded_token: dict,
                     db: Session,
                     storage_provider: Optional[str] = None,
                     storage_credentials: Optional[dict] = None):
        payload = request_payload.model_dump()
        image_paths = payload['images_path']
        filters = {"email": decoded_token["email"], "team_id": str(team_id)}
        team_member_service.role_validation(filters=filters, db=db)

        if storage_provider:
            # Use cloud storage
            driver = get_driver(storage_provider)
            conn = driver(**storage_credentials)
            container_name = str(project_id)
            container = conn.get_container(container_name)
            if not container:
                container = conn.create_container(container_name)
                print(f"Container '{container_name}' created successfully.")

            for image_path in image_paths:
                image_filename = os.path.basename(image_path)
                try:
                    with open(image_path, 'rb') as image_file:  # Use open() for streaming
                        container.upload_object_via_stream(image_filename, image_file)  # Use streaming upload
                    print(f"Image '{image_filename}' uploaded successfully to '{container_name}'.")
                except FileNotFoundError:
                    print(f"Error: The specified image file '{image_path}' was not found.")

        else:
            # Use local storage (for development)
            current_directory = os.getcwd()
            folder_name = str(project_id)
            folder_path = os.path.join(current_directory, folder_name)
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
                print(f"Folder '{folder_name}' created successfully.")

            for image_path in image_paths:
                image_filename = os.path.basename(image_path)
                destination_path = os.path.join(folder_path, image_filename)
                try:
                    shutil.copyfile(image_path, destination_path)
                    print(f"Image '{image_filename}' uploaded successfully to '{folder_name}'.")
                except FileNotFoundError:
                    print(f"Error: The specified image file '{image_path}' was not found.")

        response = {"detail":"Images uploaded successfully"}
        return response
    

image_service = ImageService
