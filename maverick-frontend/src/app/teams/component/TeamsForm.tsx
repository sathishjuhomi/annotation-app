"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material/styles";
import Avatar from '@mui/material/Avatar';
import { TeamsProps } from '@/app/component/interfaces';
import Snackbar from "../../component/Snackbar";
import CircularProgress from '@mui/material/CircularProgress';
import CreateUpdateForm from './CreateUpdateForm';
import { useRouter } from "next/navigation";
import ViewTeamAndTeamMembers from './ViewTeamMembers';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const defaultTheme = createTheme();

export default function TeamList(
  {
    loading,
    showMessage,
    setShowMessage,
    message,
    messageColor,
    onSubmit,
    formHandleSubmit,
    register,
    errors,
    teams,
    onAcceptTeamInvite,
    onDeclineTeamInvite,
  }: TeamsProps
) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const router = useRouter();

  const [expandedTeamMemberId, setExpandedTeamMemberId] = React.useState(null)
  const handleViewTeamMembers = (id: any) => {
    setExpandedTeamMemberId(id)
  };

  const teamNameValue = typeof localStorage !== 'undefined' ? localStorage.getItem('teamName') : null;
  const onSwitchTeam = (teamName: string) => {
    localStorage.setItem('teamName', teamName)
    location.reload()
  };
  return (
    <Box className="mt-10 w-full mr-4">
      <div className="flex justify-between pb-5">
        <Typography className="text-left font-Inter font-bold leading-7 text-xl">Teams</Typography>
        <Button
          size="small"
          variant="contained"
          className="w-28 h-11 normal-case font-Inter font-normal font-bold text-sm text-white bg-button hover:bg-lightgreen"
          onClick={handleClickOpen}
        >
          Create Team
        </Button>
      </div>
      <CreateUpdateForm
        loading={loading}
        showMessage={showMessage}
        setShowMessage={setShowMessage}
        message={message}
        messageColor={messageColor}
        onSubmit={onSubmit}
        formHandleSubmit={formHandleSubmit}
        register={register}
        errors={errors}
        open={open}
        setOpen={setOpen}
        teamTitle="Create Team"
        teamId={setExpandedTeamMemberId}
      />
      {teams.length > 0 ? teams.map((team: any) => (
        <Box className='m-3'>
          <Accordion className='shadow-none divide-y-2 divide-lightgrey'
            onClick={() => { handleViewTeamMembers(team.team_id) }}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  className='w-9 h-9'
                />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Avatar className="bg-black font-bold font-Inter leading-6 text-sm text-white">
                {team.team_name[0]}
              </Avatar>
              <Typography className="ml-5 mt-2 font-bold font-Inter leading-6 text-sm text-black">
                {team.team_name}
              </Typography>
              {team.is_activated === true && team.team_name === teamNameValue
                ?
                <Typography className='ml-auto mt-2 text-black font-Inter font-normal text-sm leading-6'>
                  Current Team
                </Typography>
                :
                <Button
                  className={
                    team.is_activated === true
                      ? 'ml-auto mt-1 mb-1 mr-6 font-Inter font-normal leading-6 text-sm normal-case text-black hover:text-green hover:bg-white'
                      : 'ml-auto mt-1 mb-1 mr-2 font-Inter font-normal leading-6 text-sm normal-case text-black hover:text-green hover:bg-white'}
                  size="small"
                  onClick={() => {
                    team.is_activated === false ? onAcceptTeamInvite(team.invite_token) : onSwitchTeam(team.team_name)
                  }
                  }
                >
                  {team.is_activated === true ? "Switch" : "Approve"}
                </Button>
              }
              {team.is_activated === true ? null :
                <Typography className='mt-2 mr-2 text-lightgrey'>|</Typography>
              }
              <Button
                className={
                  team.is_activated === true
                    ? 'hover:bg-white'
                    : 'mt-1 mb-1 font-Inter font-normal leading-6 text-sm normal-case text-black hover:text-red hover:bg-white'
                }
                size="small"
                onClick={() => {
                  if (team.is_activated === true) { }
                  else {
                    onDeclineTeamInvite(team.invite_token);
                  }
                }}
              >
                {team.is_activated === true ? "" : "Decline"}
              </Button>
            </AccordionSummary>
            <AccordionDetails className='mt-0' >
              {expandedTeamMemberId !== null && expandedTeamMemberId === team.team_id ?
                <Box>
                  <ViewTeamAndTeamMembers
                    id={team.team_id} />
                </Box>
                : null}
            </AccordionDetails>
          </Accordion>
        </Box>
      )) : <Box>
        <Typography className='text-center mt-10 mb-2'> No Teams </Typography>
        <br />
      </Box>
      }
      {
        message !== "" ? (
          <Snackbar
            showMessage={showMessage}
            setShowMessage={setShowMessage}
            message={message}
            messageColor={messageColor}
          />
        ) : null
      }
      {
        loading ? (
          <Box
            className="text-greyplus mt-auto flex justify-center items-center"
          >
            <CircularProgress color="inherit" />
          </Box>
        ) : null
      }
    </Box >
  );
}