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

  // Fetch the showTeams data using the getServerSideProps function
  useEffect(() => {
    async function fetchData() {
      const { props } = await teamList();
      setTeams(props.teams);
      try {
        const teamName = localStorage.getItem('teamName');
        if (teamName === null) {
          localStorage.setItem('teamName', props.teams[0]['team_name']);
        }
      } catch (error) {
        const data = props.teams.detail;
        setMessage(data);
        setMessageColor(Constants.ERROR);
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // Create Team using the getServerSideProps function
  const submit = async (data: TeamsFormData) => {
    setShowMessage(true);
    setLoading(true);
    const { props } = await createTeam(data)
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

// Accept Team Member invite
const onAcceptTeamInvite = async (inviteToken: any) => {
  setShowMessage(true);
  setLoading(true);
  const {props} = await acceptTeamInvite(inviteToken)
  try{
        const data = props.acceptInvite.detail;
        setMessage(data);
        setMessageColor(Constants.SUCCESS);
        location.reload();
      setLoading(false);
    } catch (error) {
      const data = props.acceptInvite.detail;
      setMessage(data);
      setMessageColor(Constants.ERROR);
      console.error('Error fetching data:', error);
    }
};

// Decline Team Invite
const onDeclineTeamInvite = async (inviteToken: any) => {
  setShowMessage(true);
  setLoading(true);
  const {props} = await declineTeamInvite(inviteToken)
  try{
        const data = props.declineInvite.detail;
        setMessage(data);
        setMessageColor(Constants.SUCCESS);
        location.reload();
      setLoading(false);
    } catch (error) {
      const data = props.declineInvite.detail;
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
