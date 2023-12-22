import { FormData } from "../../component/interfaces";

export async function signIn(formData: FormData) {
  const body = { email: formData.email, password: formData.password };
  const res = await fetch("http://127.0.0.1:8000/api/v1/user/sign-in", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

export async function signInOauth() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/user/oauth-login", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    mode: "no-cors",
  });
  return res;
}