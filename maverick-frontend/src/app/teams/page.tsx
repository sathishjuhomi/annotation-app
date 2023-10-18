"use client"
import * as React from "react";
import { createTheme } from "@mui/material/styles";
import TeamsForm from "./component/TeamsForm";
import NavBar from "../component/NavBar";
import Box from "@mui/material/Box";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import {createOrUpdateTeamSchema } from "./validation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Constants from "../utils/constant";
import { useRouter, useSearchParams } from "next/navigation";
import { TeamsFormData } from "./../component/interfaces";
import { createTeam, teamList, acceptTeamInvite,declineTeamInvite } from "./api/route";

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
 
  useEffect(() => {
    setLoading(true);
    const response = teamList()
      .then(async (res) => {
        const response = await res.json();
        console.log("response", response)
        if (res.status === 200) {
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
          console.log("Create team res", response);
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

  const params = useSearchParams();
  const invite_token = params.get('token')
  const team_member_id = params.get('team_id')
  const invitee_email = params.get('email_to')

  console.log("invite_token", invite_token)
  console.log("team_member_id", team_member_id)
  console.log("emailinvite", invitee_email)

  const acceptInviteTeam = async () => {
      setShowMessage(true);
      setLoading(true);
      const response = await acceptTeamInvite(invite_token, team_member_id,  invitee_email)
          .then(async (res) => {
              const response = await res.json();
              if (res.status === 200) {
                  setMessage(response.message);
                  setMessageColor(Constants.SUCCESS);
                  router.push("/teams");
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
  
  const invite_token_decline = params.get('invite_token')
  const team_member_id_decline = params.get('team_member_id')

  console.log("invite_token_decline", invite_token_decline)
  console.log("team_member_id_decline", team_member_id_decline)

  const declineInviteTeam = async () => {
    setShowMessage(true);
    setLoading(true);
    const response = await declineTeamInvite(invite_token_decline, team_member_id_decline)
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
          acceptInviteTeam={acceptInviteTeam}
          declineInviteTeam={declineInviteTeam}
          />
      </Box>
    </Box>
  );

};
export default Teams;
