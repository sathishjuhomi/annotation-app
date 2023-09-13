"use client";
import React from "react";
import { useForm } from "react-hook-form";
import SignInForm from "./component/SignInForm";
import { FormData } from "../component/interfaces";
import registerSchema from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "./api/route";
import * as Constants from "../utils/constant";

const SignIn = () => {
 const [loading, setLoading] = React.useState(false);
 const [showMessage, setShowMessage] = React.useState(false);
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
    setShowMessage(true);
    await signIn(data)
      .then(async (res) => {
        const response = await res.json();
        const data = response.detail;
        if (res.status === 200) {
          setMessage(data);
          setMessageColor(Constants.SUCCESS);
        } else {
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
    <SignInForm
      loading={loading}
      showMessage={showMessage}
      setShowMessage={setShowMessage}
      message={message}
      messageColor={messageColor}
      onSubmit={submit}
      register={register}
      formHandleSubmit={handleSubmit}
      errors={errors}
    />
  );
};

export default SignIn;
