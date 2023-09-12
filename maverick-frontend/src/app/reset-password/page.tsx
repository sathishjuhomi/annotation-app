"use client";
import React from "react";
import { useForm } from "react-hook-form";
import ResetPasswordForm from "./component/ResetPasswordForm";
import { FormData } from "./interfaces";
import registerSchema from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPassword } from "./api/route";
import * as Constants from "../utils/constant";
import { useSearchParams } from 'next/navigation';

const ResetPassword = () => {
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

  const params = useSearchParams();
  const token = params.get('token')
  
  const submit = async (data: FormData) => {
    setShowMessage(true);
    setLoading(true);
    const response = await resetPassword(data, token)
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
    <ResetPasswordForm
      loading={loading}
      setLoading={setLoading}
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

export default ResetPassword;
