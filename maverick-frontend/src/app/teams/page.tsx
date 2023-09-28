"use client"
import * as React from "react";
import { createTheme } from "@mui/material/styles";
import TeamsForm from "./component/TeamsForm";
import NavBar from "../component/NavBar";
import Box from "@mui/material/Box";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import registerSchema from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Constants from "../utils/constant";
import { useRouter } from "next/navigation";
import { TeamsFormData } from "./../component/interfaces";
import { createTeam, teamList } from "./api/route";

const defaultTheme = createTheme();

const Teams = () =>{
    const [loading, setLoading] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageColor, setMessageColor] = React.useState(Constants.INFO);
  const [teams, setTeams] = React.useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const response = teamList()
      .then(async (res) => {
        const response = await res.json();
        console.log("response", response)
        if (res.status === 201) {
          setTeams(response);
        }
         setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const submit = async (data: TeamsFormData) => {
    setShowMessage(true);
    setLoading(true);
    const response = await createTeam(data)
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 201) {
          setMessage(Constants.TEAM_CREATED_SUCCESSFULLY);
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
        <Box className="flex">
        <NavBar></NavBar>
        <Box component="main" className="mt-10"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
        <TeamsForm
        loading={loading}
        showMessage={showMessage}
        setShowMessage={setShowMessage}
        message={message}
        messageColor={messageColor}
        onSubmit={submit}
        formHandleSubmit={handleSubmit}
        register={register}
        errors={errors}/>
        </Box>
        </Box>
    );  

};
export default Teams;
