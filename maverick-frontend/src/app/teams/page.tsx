"use client"
import * as React from "react";
import { createTheme } from "@mui/material/styles";
import TeamsForm from "./component/TeamsForm";
import NavBar from "../component/NavBar";
import Box from "@mui/material/Box";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { createOrUpdateTeamSchema } from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Constants from "../utils/constant";
import { useRouter } from "next/navigation";
import { TeamsFormData } from "./../component/interfaces";
import { createTeam, teamList, acceptTeamInvite, declineTeamInvite } from "./api/route";


const defaultTheme = createTheme();

const Teams = () => {
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
    resolver: yupResolver(createOrUpdateTeamSchema),
  });
  const router = useRouter();

  // useEffect(() => {
  //   setLoading(true);
  //   const response = teamList()
  //     .then(async (res) => {
  //       const response = await res.json();
  //       if (res.status === 200) {
  //         const teamName = localStorage.getItem('teamName');
  //         if (teamName === null) {
  //           localStorage.setItem('teamName', response[0]['team_name'])
  //         }
  //         setTeams(response);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //     });
  // }, []);


  // Fetch the showTeams data using the getServerSideProps function
  useEffect(() => {
    async function fetchData() {
      const { props } = await teamList();
      setTeams(props.teams);
      if (props.teams.status === 200) {
        const teamName = localStorage.getItem('teamName');
        if (teamName === null) {
          localStorage.setItem('teamName', props.teams[0]['team_name'])
        }
        setTeams(props.teams);
      }
    }
      fetchData();
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

  const onAcceptTeamInvite = async (inviteToken: any) => {
    setShowMessage(true);
    setLoading(true);
    const response = await acceptTeamInvite(inviteToken)
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 200) {
          setMessage(response.message);
          setMessageColor(Constants.SUCCESS);
          location.reload();
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


  const onDeclineTeamInvite = async (inviteToken: any) => {
    setShowMessage(true);
    setLoading(true);
    const response = await declineTeamInvite(inviteToken)
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 200) {
          setMessage(response.message);
          setMessageColor(Constants.SUCCESS);
          location.reload();
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
          errors={errors}
          teams={teams}
          onAcceptTeamInvite={onAcceptTeamInvite}
          onDeclineTeamInvite={onDeclineTeamInvite}
        />
      </Box>
    </Box>
  );

};
export default Teams;
