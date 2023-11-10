"use client";
import * as React from "react";
import PlansForm from "./component/PlansForm";
import Box from "@mui/material/Box";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { createPlanSchema } from "./validation";
import { CreatePlanFormData } from "./../component/interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Constants from "../utils/constant";
import { createPlan, planList } from "./api/route";


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
    const submit = async (data: CreatePlanFormData) => {
      setShowMessage(true);
      const response = await createPlan(data)
        .then(async (res) => {
          const response = await res.json();
          if (res.status === 201) {
            setMessage(Constants.PLAN_CREATED_SUCCESS);
            setMessageColor(Constants.SUCCESS);
            location.reload()
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

    
// View Plans

  useEffect(() => {
    async function fetchData() {
      const { props } = await planList();
      try {
        setPlans(props.plans);
      } catch (error) {
        const data = props.plans.detail;
        setMessage(data);
        setMessageColor(Constants.ERROR);
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <Box className="flex">
      <Box component="main" className="mb-4"
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