export async function acceptTeamInvite(token: any) {
    const storedAccessToken = sessionStorage.getItem('access_token');
    const res = await fetch(`http://127.0.0.1:8000/api/v1/user/teams/team-members/accept-invitation?token=${token}`,
     {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "token": `${storedAccessToken}`,
        },
    });
    return res;
  }