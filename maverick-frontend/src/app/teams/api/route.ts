import { TeamsFormData } from "../../component/interfaces";
import { InviteATeamMemberFormData, UpdateATeamMemberFormData } from "../../component/interfaces"

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
  const data = await res.json();
  return {
    props: {
      create: data
    }
  };
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
  const data = await res.json();
  return {
    props: {
      teams: data
    }
  };
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
  const data = await res.json();
  return {
    props: {
      teamMembers: data
    }
  };
}

export async function updateTeam(teamId: string, formData: TeamsFormData) {
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
  const data = await res.json();
  return {
    props: {
      update: data
    }
  };
}

export async function deleteTeam(teamId: string) {
  const accessToken = localStorage.getItem('access_token');
  const res = await fetch(`http://127.0.01:8000/api/v1/teams/${teamId}/delete`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${accessToken}`,
    }
  });
  const data = await res.json();
  return {
    props: {
      delete: data
    }
  };
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
  const data = await res.json();
  return {
    props: {
      inviteMember: data
    }
  };
}

export async function acceptTeamInvite(invite_token: any) {
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
  const data = await res.json();
  return {
    props: {
      acceptInvite: data
    }
  };
}

export async function declineTeamInvite(invite_token: any) {
  const accessToken = localStorage.getItem('access_token');
  const res = await fetch
    (`http://127.0.0.1:8000/api/v1/teams/team-members/decline-invitation?invite_token=${invite_token}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${accessToken}`,
        },
      });
  const data = await res.json();
  return {
    props: {
      declineInvite: data
    }
  };
}

export async function deleteTeamMember(team_id: string, team_member_id: string) {
  const accessToken = localStorage.getItem('access_token');
  const res = await fetch
    (`http://127.0.0.1:8000/api/v1/teams/${team_id}/team-members/${team_member_id}/delete`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${accessToken}`,
        },
      });
  const data = await res.json();
  return {
    props: {
      deleteMember: data
    }
  };
}

export async function updateTeamMemberRole(team_id: string, team_member_id: string, formData: UpdateATeamMemberFormData) {
  const accessToken = localStorage.getItem('access_token');
  const body = {
    roles: {
      owner: formData.owner,
      admin: formData.admin,
      member: formData.member,
    }
  }
  const res = await fetch
    (`http://127.0.0.1:8000/api/v1/teams/${team_id}/team-members/${team_member_id}/update-role`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          "authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
  const data = await res.json();
  return {
    props: {
      updateMember: data
    }
  };
}

export async function activePlanList(getAllPlans: boolean) {
  const accessToken = localStorage.getItem('access_token');
  const res = await fetch(`http://127.0.0.1:8000/api/v1/plans?get_all_plans=${getAllPlans}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "authorization": `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();
  return {
    props: {
      plans: data
    }
  };
}

export async function upgradePlan(teamId: string, priceId: string, paymentType: string) {
  const accessToken = localStorage.getItem('access_token');
  const body = {payment_type: paymentType}
  const res = await fetch(`http://127.0.0.1:8000/api/v1/checkout-session/teams/${teamId}?price_id=${priceId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(body),
    });
  const data = await res.json();
  console.log("Route data: ", data)
  return {
    props: {
      data: data
    }
  };
}