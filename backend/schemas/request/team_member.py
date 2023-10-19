from pydantic import BaseModel, Field, EmailStr
from pydantic import BaseModel, Field, EmailStr


class MemberRoleSchema(BaseModel):
    roles: dict = Field({
        "owner": False,
        "admin": False,
        "member": False
    })


class TeamMemberSchema(MemberRoleSchema):
    email: EmailStr
