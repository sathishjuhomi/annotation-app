"use client";
import React from "react";
import { useForm } from "react-hook-form";
import SignInForm from "./component/SignInForm";
import { FormData } from "../component/interfaces";
import registerSchema from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn, signInOauth } from "./api/route";
import * as Constants from "../utils/constant";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  
  const setAccessToken = (response:any) => {
    const accessToken = response.access_token;
    localStorage.setItem('access_token', accessToken);
  };

  const submit = async (data: FormData) => {
    setShowMessage(true);
    setLoading(true);
    await signIn(data)
      .then(async (res) => {
        const response = await res.json();
        const responseData = response.detail;
        if (res.status === 200) {
          localStorage.setItem('emailId', data.email);
          setAccessToken(response);
          setMessage(responseData);
          setMessageColor(Constants.SUCCESS);
          router.push("/docs/installation");
        } else {
          setMessage(responseData);
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

  const submitOauth = async () => {
    setShowMessage(true);
    setLoading(true);
    await signInOauth()
      .then(async (res) => {
        const response = await res.json();
        const data = response.detail;
        if (res.status === 200) {
          setAccessToken(response);
          setMessage(data);
          setMessageColor(Constants.SUCCESS);
          router.push("/docs/installation");
        } else {
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
    <SignInForm
      loading={loading}
      showMessage={showMessage}
      setShowMessage={setShowMessage}
      message={message}
      messageColor={messageColor}
      onSubmit={submit}
      register={register}
      formHandleSubmit={handleSubmit}
      handleOauth={submitOauth}
      errors={errors}
    />
  );
};

export default SignIn;
