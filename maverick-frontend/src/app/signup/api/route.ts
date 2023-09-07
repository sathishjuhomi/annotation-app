import { NextResponse } from "next/server";
import { FormData } from "../interfaces";

export async function signup(formData: FormData) {
  const body = { email: formData.email, password: formData.password };
  const res = await fetch("http://127.0.0.1:8000/api/v1/user/sign-up", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}
