from pydantic import UUID4, BaseModel, EmailStr


class SignUpResponseSchema(BaseModel):
    id: UUID4
    email: EmailStr


class DetailSchema(BaseModel):
    detail: str


class SignInResponseSchema(DetailSchema):
    access_token: str
