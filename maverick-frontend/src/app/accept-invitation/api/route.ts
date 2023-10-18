export async function acceptTeamInvite( invite_token: any, team_member_id:any, invitee_email:any ) {
    const accessToken = sessionStorage.getItem('access_token');
    console.log("ACCESSTOKEN: ", accessToken)
    const res = await fetch
        (`http://127.0.0.1:8000/api/v1/teams/team-members/accept-invitation?invite_token=${invite_token}&team_member_id=${team_member_id}&invitee_email=${invitee_email}`,
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
    const storedAccessToken = sessionStorage.getItem('access_token');
    const res = await fetch(`http://127.0.0.1:8000/api/v1/teams/team-members/member-detail?invite_token=${invite_token}`, {
      method: "GET",
      headers: { 
        "Content-type": "application/json",
        "authorization": `Bearer ${storedAccessToken}`,
     },
    });
    return res;
  }