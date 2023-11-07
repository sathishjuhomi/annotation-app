import { CreatePlansFormData } from "@/app/component/interfaces";

export async function createPlan(formData: CreatePlansFormData) {
    const accessToken = localStorage.getItem('access_token');
    const body = {  };
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