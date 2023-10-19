"use client";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { createTheme } from "@mui/material/styles";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { TeamsProps } from '@/app/component/interfaces';
import Snackbar from "../../component/Snackbar";
import CircularProgress from '@mui/material/CircularProgress';
import CreateUpdateForm from './CreateUpdateForm';
import VisibilityIcon from '@mui/icons-material/VisibilityRounded';
import SwitchIcon from '@mui/icons-material/SwapHoriz';
// import AcceptIcon from '@mui/icons-material/DoneOutline';
import AcceptIcon from '@mui/icons-material/Check';
import DeclineIcon from '@mui/icons-material/Cancel';
import { useRouter } from "next/navigation";
import { Fab } from '@mui/material';
import { declineTeamInvite } from '../api/route';

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

  return (
    <Box className="mt-4 w-full mr-4">
      <Paper elevation={3} className="ml-2 mr-2">
        <br></br>
        <div className="flex justify-between">
          <Typography className="mt-0 ml-4 text-left font-bold text-xl">Teams</Typography>
          <Button
            size="small"
            variant="contained"
            className="text-white bg-primary mr-4"
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
          teamTitle="Create New Team"
        />
        {teams.length > 0 ? teams.map((team: any) => (
          <List>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar className="bg-tertiary">{team.team_name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText className="mt-5 font-bold text-black">
                {team.team_name}
              </ListItemText>
              <Fab
                className={team.is_activated === true ? 'ml-18 mt-1 mb-1 mr-6 text-white bg-tertiary' : 'ml-18 mt-1 mb-1 mr-6 text-black bg-green'}
                size="small"
                onClick={() => {
                  team.is_activated === false ? onAcceptTeamInvite(team.invite_token) : onDeclineTeamInvite(team.invite_token)
                }
                }
              >
                {team.is_activated === true ? <SwitchIcon/> : <AcceptIcon/>}
              </Fab>
              <Fab
                className={team.is_activated === true ? 'ml-1 mt-1 mb-1 text-white bg-primary' : 'ml-1 mt-1 mb-1 text-white bg-grey'}
                size="small"
                onClick={() => {
                  if (team.is_activated === true) {
                    router.push(`/teams/${team.team_id}`);
                  } else {
                    router.push('/teams');
                  }
                }}
              >
                {team.is_activated === true ? <VisibilityIcon/> : <DeclineIcon/>}
              </Fab>
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        )) : <Box>
          <Typography className='text-center mt-10 mb-2'> No Teams </Typography>
          <br />
        </Box>}
      </Paper>
      {message !== "" ? (
        <Snackbar
          showMessage={showMessage}
          setShowMessage={setShowMessage}
          message={message}
          messageColor={messageColor}
        />
      ) : null}
      {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : null}
    </Box>
  );
}