from backend.db_handler.project_handler import project_db_handler
from backend.schemas.request.project import ProjectRequestSchema
from backend.service.team import team_service
from backend.service.team_member import team_member_service
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from pydantic import UUID4
import uuid


class ProjectService():
    @staticmethod
    def create_project(decoded_token: dict,
                       request_payload: ProjectRequestSchema,
                       team_id: UUID4,
                       db: Session):
        """
        This function will create a project inside a team,
        by validating user role and team existence.

        :param decoded_token: Have signed in user email and user_id.
        :param request_payload: Input from the user to create a project.
        :param team_id: Inside this team, the project has to be created.
        :param db: Database.

        :return detail: Project created successfully.
        """
        # Check if the inviter has 'owner' or 'admin' roles
        filters = {"email": decoded_token["email"], "team_id": str(team_id)}
        team_service.get_team(db=db, id=team_id)  # Use the result if needed
        team_member_service.role_validation(filters=filters, db=db)

        project_details = request_payload.model_dump()
        project_details["id"] = uuid.uuid4()
        project_details["team_id"] = team_id
        project_details["created_by_id"] = decoded_token["id"]

        try:
            response = project_db_handler.create(
                db=db, input_object=project_details)
        except Exception as e:
            detail = "Error Creating Project"
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=detail
            )

        return response

    @staticmethod
    def rename_project(project_id: UUID4,
                       request_payload,
                       decoded_token: dict,
                       db: Session):
        project_details = request_payload.model_dump()
        project = project_db_handler.load_by_id(db=db, id=project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        project_details["updated_by_id"] = decoded_token["id"]
        try:
            response = project_db_handler.update(db=db,
                                      db_obj=project,
                                      input_object=project_details)
        except:
            detail = "Error renaming project"
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=detail
            )
        return response


project_service = ProjectService()
