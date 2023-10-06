import { TeamsFormData } from "../../component/interfaces";
import { InviteATeamMemberFormData } from "../../component/interfaces"

export async function createTeam(formData: TeamsFormData) {
    const storedAccessToken = sessionStorage.getItem('access_token');
    const body = { team_name: formData.teamname };
    const res = await fetch("http://127.0.0.1:8000/api/v1/teams", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "token": `${storedAccessToken}`,
      },
      body: JSON.stringify(body),
    });
  
    return res;
  }

  export async function teamList() {
    const storedAccessToken = sessionStorage.getItem('access_token');
    const res = await fetch("http://127.0.0.1:8000/api/v1/teams", {
      method: "GET",
      headers: { 
        "Content-type": "application/json",
        "token": `${storedAccessToken}`,
     },
    });
    return res;
  }

  export async function getTeamAndTeamMembers(teamId: string) {
    const storedAccessToken = sessionStorage.getItem('access_token');
    const res = await fetch(`http://127.0.0.1:8000/api/v1/teams/${teamId}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "token": `${storedAccessToken}`,
        },
    });
    return res;
}

export async function updateTeam(teamId: string, formData:TeamsFormData) {
  const storedAccessToken = sessionStorage.getItem('access_token');
  const body = { team_name: formData.teamname };
  const res = await fetch(`http://127.0.0.1:8000/api/v1/teams/${teamId}`, {
      method: "PATCH",
      headers: {
          "Content-type": "application/json",
          "token": `${storedAccessToken}`,
      },
      body: JSON.stringify(body),
  });
  return res;
}

export async function deleteTeam(teamId:string){
  const storedAccessToken = sessionStorage.getItem('access_token');
  const res = await fetch(`http://127.0.01:8000/api/v1/teams/${teamId}/delete`,{
    method: "PATCH",
    headers:{
      "content-type": "application/json",
      "token": `${storedAccessToken}`,
    }
  });
  return res;
}

export async function inviteATeamMember(teamId: string, formData: InviteATeamMemberFormData) {
  const storedAccessToken = sessionStorage.getItem('access_token');
  const body = {
    email: formData.email,
    role: {
      admin: formData.admin,
      member: formData.member,
      owner: false
    }
  }
  const res = await fetch(`http://127.0.0.1:8000/api/v1/teams/${teamId}/team-members/invite`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "token": `${storedAccessToken}`,
      },
      body: JSON.stringify(body),
    });
  return res;
}