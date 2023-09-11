from pydantic import UUID4, BaseModel, EmailStr


class SignUpResponseSchema(BaseModel):
    id: UUID4
    email: EmailStr


class MsgSchema(BaseModel):
    message: str


class SignInResponseSchema(MsgSchema):
    access_token: str
