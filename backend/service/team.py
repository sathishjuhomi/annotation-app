import uuid

from sqlalchemy.orm import Session
from backend.db_handler.team_handler import team_db_handler
from backend.utils.utils import get_user_id
from backend.schemas.request.team import TeamSchema
from backend.models.team import Teams


class TeamService():
    @staticmethod
    def preprocess_team_data(request_payload, db):
        team = request_payload.model_dump()
        created_by = get_user_id(team["token"], db)
        team["created_by"] = created_by
        team.pop("token", None)
        return team

    def create_team(self, request_payload: TeamSchema, db: Session):
        team = self.preprocess_team_data(request_payload, db)
        team["id"] = uuid.uuid4()
        return team_db_handler.create(db, input_object=team)

    def update_team(self, request_payload: TeamSchema, team: Teams, db: Session):
        team_data = self.preprocess_team_data(request_payload, db)
        return team_db_handler.update(db=db, db_obj=team, input_object=team_data)


team_service = TeamService()
