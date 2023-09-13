"use client";
import React from "react";
import { useForm } from "react-hook-form";
import ForgotPasswordForm from "./component/ForgotPasswordForm";
import { FormData } from "../component/interfaces";
import registerSchema from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPassword } from "./api/route";
import * as Constants from "../utils/constant";

const ForgotPassword = () => {
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
    setLoading(true);
    await forgotPassword(data)
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 200) {
          setMessage(response.message);
          setMessageColor(Constants.SUCCESS);
        } else {
          const data = response.detail;
          setMessage(data);
          setMessageColor(Constants.ERROR);
        }
        setLoading(false);
      })
      .catch((error) => {
        setMessage(error);
        setLoading(false);
        setMessageColor(Constants.ERROR);
      });
  };

  return (
    <ForgotPasswordForm
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

export default ForgotPassword;
