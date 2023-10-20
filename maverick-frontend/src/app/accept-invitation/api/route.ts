export async function acceptTeamInvite( invite_token: any) {
    const accessToken = localStorage.getItem('access_token');
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

export async function getMemberDetail( invite_token : any ) {
    const storedAccessToken = localStorage.getItem('access_token');
    const res = await fetch(`http://127.0.0.1:8000/api/v1/teams/team-members/member-detail?invite_token=${invite_token}`, {
      method: "GET",
      headers: { 
        "Content-type": "application/json",
        "authorization": `Bearer ${storedAccessToken}`,
     },
    });
    return res;
  }