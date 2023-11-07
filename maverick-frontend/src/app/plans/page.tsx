"use client";
import * as React from "react";
import PlansForm from "./component/PlansForm";
import NavBar from "../component/NavBar";
import Box from "@mui/material/Box";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { createPlanSchema } from "./validation";
import { CreatePlanFormData } from "./../component/interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Constants from "../utils/constant";
import { createPlan, planList } from "./api/route";


const Plans = () => {

  console.log("Page: ")
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

  useEffect(() => {
    async function fetchData() {
      const { props } = await planList();
      try {
        console.log("Plans: ", props.plans);
        setPlans(props.plans);
        // Additional logic can go here
      } catch (error) {
        const data = props.plans.detail;
        setMessage(data);
        setMessageColor(Constants.ERROR);
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     const { props } = await planList();
  //     setPlans(props.plans);
  //     console.log("Plans: ", props.plans)
  //     try {
  //       setPlans(props.plans);
  //       // const plan = localStorage.getItem('teamName');
  //       // if (teamName === null) {
  //       //   localStorage.setItem('teamName', props.teams[0]['team_name']);
  //       // }
  //     } catch (error) {
  //       const data = props.plans.detail;
  //       setMessage(data);
  //       setMessageColor(Constants.ERROR);
  //       console.error('Error fetching data:', error);
  //     }
  //   }

  //   fetchData();
  // }, []);

  // Create Plan
  const submit = async (data: CreatePlanFormData) => {
    console.log("CReatePLANS: Submit: ")
    setShowMessage(true);
    setLoading(true);
    const response = await createPlan(data)
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 201) {
          setMessage(Constants.USER_SUCCESS);
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