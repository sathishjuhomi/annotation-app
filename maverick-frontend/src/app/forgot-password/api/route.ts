import { FormData } from "../../component/interfaces";

export async function forgotPassword(formData: FormData) {
  const email = formData.email;
  const res = await fetch(`http://127.0.0.1:8000/api/v1/user/password-recovery/${email}`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
  });
  return res;
}

