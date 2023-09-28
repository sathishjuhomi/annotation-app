import { TeamsFormData } from "../../component/interfaces";

export async function createTeam(formData: TeamsFormData) {
    const storedAccessToken = sessionStorage.getItem('access_token');
    console.log('Stored Access Token:', storedAccessToken);

    const body = {
      team_name: formData.teamname,
      token: String(storedAccessToken), // Convert the access token to a string
    };
  
    const res = await fetch("http://127.0.0.1:8000/api/v1/teams", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${storedAccessToken}`, // Include the access token in the Authorization header
      },
      body: JSON.stringify(body),
    });
  
    return res;
  }

  export async function teamList() {
    const res = await fetch("http://127.0.0.1:8000/api/v1/teams", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    return res;
  }