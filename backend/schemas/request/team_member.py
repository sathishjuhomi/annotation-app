from pydantic import BaseModel, Field, EmailStr


class TeamMemberSchema(BaseModel):
    email: EmailStr
    role: dict = Field({
        "owner": False,
        "admin": False,
        "member": False
    })
