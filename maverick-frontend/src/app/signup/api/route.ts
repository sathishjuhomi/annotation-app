import { NextResponse } from "next/server";
import { FormData } from "../interfaces";

export async function POST(formData: FormData) {
  console.log("data: ", formData);
  const body = { email: formData.email, password: formData.password };
  const res = await fetch("http://localhost:3000/api/v1/user", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return NextResponse.json(data);
}
