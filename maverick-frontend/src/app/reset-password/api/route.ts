import { FormData } from "../interfaces";

export async function resetPassword(formData: FormData, token: any) {
  const body = {new_password : formData.password}
  const res = await fetch(`http://127.0.0.1:8000/api/v1/user/reset-password?token=${token}`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

