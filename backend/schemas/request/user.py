from pydantic import BaseModel, EmailStr


class UserSchema(BaseModel):
    email: EmailStr
    password: str

class OauthUserSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    new_password: str
