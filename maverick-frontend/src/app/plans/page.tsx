"use client";
import * as React from "react";
import PlansForm from "./component/PlansForm";
import NavBar from "../component/NavBar";
import Box from "@mui/material/Box";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { createPlanSchema } from "./validation";
import { CreatePlansFormData } from "./../component/interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Constants from "../utils/constant";
import { createPlan } from "./api/route";


const Plans = () => {

  const [loading, setLoading] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageColor, setMessageColor] = React.useState(Constants.INFO);
  const [plans, setPlans] = React.useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createPlanSchema),
  });


  // Create Plan
  const submit = async (data: CreatePlansFormData) => {
    setShowMessage(true);
    setLoading(true);
    const { props } = await createPlan(data)
    try {
      if ((Object.keys(props.create).length) > 1) {
        setMessage(Constants.TEAM_CREATED_SUCCESSFULLY);
        setMessageColor(Constants.SUCCESS);
        location.reload()
      } else {
        const data = props.create.detail;
        setMessage(data);
        setLoading(false);
        setMessageColor(Constants.ERROR);
      }
      setLoading(false);
    } catch (error) {
      const data = props.create.detail;
      setMessage(data);
      setMessageColor(Constants.ERROR);
      console.error('Error fetching data:', error);
    }
  };


  return (
    <Box className="flex">
      <NavBar></NavBar>
      <Box component="main" className="mt-10"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
        <PlansForm
          loading={loading}
          showMessage={showMessage}
          setShowMessage={setShowMessage}
          message={message}
          messageColor={messageColor}
          onSubmit={submit}
          formHandleSubmit={handleSubmit}
          register={register}
          errors={errors}
          plans={plans}
        />
      </Box>
    </Box>
  );

};
export default Plans;