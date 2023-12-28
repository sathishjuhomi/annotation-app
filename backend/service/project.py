from annotation.backend.db_handler.project_handler import project_db_handler
from annotation.backend.schemas.request.project import ProjectRequestSchema
from annotation.backend.service.team import team_service
from annotation.backend.service.team_member import team_member_service
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
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
        print(project_details)

        try:
            project_db_handler.create(db=db, input_object=project_details)
            detail = {"detail": "Project Created Successfully"}
        except Exception as e:
            detail = {"detail": "Error Creating Project"}
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=detail
            )

        return detail


project_service = ProjectService()
