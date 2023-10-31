"use client";
import React from "react";
import { useForm } from "react-hook-form";
import RegisterForm from "./component/RegisterForm";
import { FormData } from "../component/interfaces";
import registerSchema from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { signup } from "./api/route";
import * as Constants from "../utils/constant";
import { useRouter } from "next/navigation";
import Onboarding from "../onboarding/index";
import Box from "@mui/material/Box";

const Register = () => {
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

  const submit = async (data: FormData) => {
    setShowMessage(true);
    setLoading(true);
    const response = await signup(data)
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 201) {
          setMessage(Constants.USER_SUCCESS);
          setMessageColor(Constants.SUCCESS);
          router.push("/signin");
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
    <Box>
    <Onboarding></Onboarding>
    <RegisterForm
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
    </Box>
  );
};

export default Register;
