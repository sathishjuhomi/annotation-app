import { TeamsFormData } from "../../component/interfaces";
import { InviteATeamMemberFormData } from "../../component/interfaces"

export async function createTeam(formData: TeamsFormData) {
    const accessToken = localStorage.getItem('access_token');
    const body = { team_name: formData.teamname };
    const res = await fetch("http://127.0.0.1:8000/api/v1/teams", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
  
    return res;
  }

  export async function teamList() {
    const accessToken = localStorage.getItem('access_token');
    const res = await fetch("http://127.0.0.1:8000/api/v1/teams", {
      method: "GET",
      headers: { 
        "Content-type": "application/json",
        "authorization": `Bearer ${accessToken}`,
     },
    });
    return res;
  }

  export async function getTeamAndTeamMembers(teamId: string) {
    const accessToken = localStorage.getItem('access_token');
    const res = await fetch(`http://127.0.0.1:8000/api/v1/teams/${teamId}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "authorization": `Bearer ${accessToken}`,
        },
    });
    return res;
}

export async function updateTeam(teamId: string, formData:TeamsFormData) {
  const accessToken = localStorage.getItem('access_token');
  const body = { team_name: formData.teamname };
  const res = await fetch(`http://127.0.0.1:8000/api/v1/teams/${teamId}`, {
      method: "PATCH",
      headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
  });
  return res;
}

export async function deleteTeam(teamId:string){
  const accessToken = localStorage.getItem('access_token');
  const res = await fetch(`http://127.0.01:8000/api/v1/teams/${teamId}/delete`,{
    method: "PATCH",
    headers:{
      "content-type": "application/json",
      "authorization": `Bearer ${accessToken}`,
    }
  });
  return res;
}

export async function inviteATeamMember(teamId: string, formData: InviteATeamMemberFormData) {
  const accessToken = localStorage.getItem('access_token');
  const body = {
    email: formData.email,
    roles: {
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
        "authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(body),
    });
  return res;
}

export async function acceptTeamInvite( invite_token : any ) {
  const accessToken = localStorage.getItem('access_token');
  console.log("ACCESSTOKEN: ", accessToken)
  const res = await fetch
      (`http://127.0.0.1:8000/api/v1/teams/team-members/accept-invitation?invite_token=${invite_token}`,
          {
              method: "PATCH",
              headers: {
                  "Content-type": "application/json",
                  "authorization": `Bearer ${accessToken}`,
              },
          });
  return res;
}

export async function declineTeamInvite( invite_token: any ) {
  const accessToken = localStorage.getItem('access_token');
  console.log("ACCESSTOKEN: ", accessToken)
  const res = await fetch
      (`http://127.0.0.1:8000/api/v1/teams/team-members/decline-invitation?invite_token=${invite_token}`,
          {
              method: "PATCH",
              headers: {
                  "Content-type": "application/json",
                  "authorization": `Bearer ${accessToken}`,
              },
          });
  return res;
}

export async function deleteTeamMember( team_id: string, team_member_id: string) {
  const accessToken = localStorage.getItem('access_token');
  console.log("ACCESSTOKEN: ", accessToken)
  const res = await fetch
      (`http://127.0.0.1:8000/api/v1/teams/${team_id}/team-members/${team_member_id}/delete`,
          {
              method: "PATCH",
              headers: {
                  "Content-type": "application/json",
                  "authorization": `Bearer ${accessToken}`,
              },
          });
  return res;
}