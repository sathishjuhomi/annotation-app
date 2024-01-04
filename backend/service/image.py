from backend.service.team_member import team_member_service
from sqlalchemy.orm import Session
import os
import shutil


class ImageService:
    def upload_image(request_payload: list,
                     team_id,
                     project_id,
                     decoded_token: dict,
                     db: Session):
        payload = request_payload.model_dump()
        image_paths = payload['images_path']
        filters = {"email": decoded_token["email"], "team_id": str(team_id)}
        team_member_service.role_validation(filters=filters, db=db)
        current_directory = os.getcwd()
        folder_name = str(project_id)
        folder_path = os.path.join(current_directory, folder_name)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(f"Folder '{folder_name}' created successfully.")
        for image_path in image_paths:
            # Extract the filename from the provided image path
            image_filename = os.path.basename(image_path)
            destination_path = os.path.join(folder_path, image_filename)
            try:
                # Copy the image file to the new folder
                shutil.copyfile(image_path, destination_path)
                print(f"Image '{image_filename}' uploaded successfully to '{folder_name}'.")
            except FileNotFoundError:
                print(f"Error: The specified image file '{image_path}' was not found.")
        response = {"detail":"Images uploaded successfully"}
        return response
    

image_service = ImageService
