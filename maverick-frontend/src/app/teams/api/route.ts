import { TeamsFormData } from "../../component/interfaces";

export async function createTeam(formData: TeamsFormData) {
    const storedAccessToken = sessionStorage.getItem('access_token');
    const body = { team_name: formData.teamname };
    const res = await fetch("http://127.0.0.1:8000/api/v1/teams", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "token": `${storedAccessToken}`, // Include the access token in the Authorization header
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