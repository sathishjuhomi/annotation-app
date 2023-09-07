"use client";
import React from "react";
import { useForm } from "react-hook-form";
import RegisterForm from "./component/RegisterForm";
import { FormData } from "./interfaces";
import registerSchema from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { signup } from "./api/route";
import * as Constants from "../utils/constant";

const Register = () => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageColor, setMessageColor] = React.useState(Constants.INFO);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const submit = async (data: FormData) => {
    setOpen(true);
    const response = await signup(data)
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 201) {
          setMessage(Constants.USER_SUCCESS);
          setMessageColor(Constants.SUCCESS);
        } else {
          const data = response.detail;
          setMessage(data);
          setMessageColor(Constants.ERROR);
        }
      })
      .catch((error) => {
        setMessage(error);
        setMessageColor(Constants.ERROR);
      });
  };

  return (
    <RegisterForm
      open={open}
      setOpen={setOpen}
      message={message}
      messageColor={messageColor}
      onSubmit={submit}
      register={register}
      formHandleSubmit={handleSubmit}
      errors={errors}
    />
  );
};

export default Register;
