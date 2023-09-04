"use client";
import React from "react";
import { useForm } from "react-hook-form";
import RegisterForm from "../component/RegisterForm"
import { FormData } from "./interfaces";
import registerSchema from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const submit = (data: FormData) => {
    console.log("data: ", data);
    // make an auth request and use setError to handle errors from there
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
