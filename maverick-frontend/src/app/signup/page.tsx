"use client";
import React from "react";
import { useForm } from "react-hook-form";
import RegisterForm from "./component/RegisterForm";
import { FormData } from "./interfaces";
import registerSchema from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { POST } from "./api/route";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const submit = async (data: FormData) => {
    const response = await POST(data)
      .then((data) => {
        console.log("DATA CREATED");
      })
      .catch((error) => {
        console.log("error: ",  error);
      });
  };

  return (
    <RegisterForm
      onSubmit={submit}
      register={register}
      formHandleSubmit={handleSubmit}
      errors={errors}
    />
  );
};

export default Register;
