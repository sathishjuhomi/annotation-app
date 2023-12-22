

export async function getMemberDetail(invite_token: any) {
    const storedAccessToken = localStorage.getItem('access_token');
    const res = await fetch(`http://127.0.0.1:8000/api/v1/teams/team-members/member-detail?invite_token=${invite_token}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            "authorization": `Bearer ${storedAccessToken}`,
        },
    });
    const data = await res.json();
    console.log("data: ",data)
    return {
        props: {
            getMember: data
        }
    };
}