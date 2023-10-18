from typing import Any

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session


class BaseDBHandler:
    def __init__(self, model):
        self.model = model

    def load_by_id(self, db: Session, id: Any):
        return db.query(self.model).filter(self.model.id == id).first()

    def load_by_column(self, db: Session, column_name: str, value: Any):
        # Dynamically access the column attribute using getattr
        column = getattr(self.model, column_name)
        return db.query(self.model).filter(column == value).first()

    def load_all(self, db: Session, *, offset: int = 0, limit: int = 100):
        return db.query(self.model).offset(offset).limit(limit).all()

    def create(self, db: Session, *, input_object):
        obj_in_data = jsonable_encoder(input_object)
        db_obj = self.model(**obj_in_data)  # type: ignore
        db.add(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj, input_object):
        obj_data = jsonable_encoder(db_obj)
        if isinstance(input_object, dict):
            update_data = input_object
        else:
            update_data = input_object.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        return db_obj

    def delete(self, db: Session, *, id: int):
        obj = db.query(self.model).get(id)
        db.delete(obj)
        return obj

    def load_all_by_column(self, db: Session, column_name: str, value: Any):
        # Dynamically access the column attribute using getattr
        column = getattr(self.model, column_name)
        return db.query(self.model).filter(column == value).all()

    def load_all_by_columns(self, db: Session, filters: dict):
        query = db.query(self.model)
        for column_name, value in filters.items():
            column = getattr(self.model, column_name)
            query = query.filter(column == value)
        return query.all()

    def bulk_update(self, db: Session, db_objs: list, input_data_list: list):
        if len(db_objs) != len(input_data_list):
            raise ValueError(
                "Length of 'objs' and 'update_data_list' must be the same.")

        for obj, update_data in zip(db_objs, input_data_list):
            obj_data = jsonable_encoder(obj)
            if isinstance(update_data, dict):
                update_dict = update_data
            else:
                update_dict = update_data.dict(exclude_unset=True)
            for field in obj_data:
                if field in update_dict:
                    setattr(obj, field, update_dict[field])

        db.add_all(db_objs)
