"use client";
import * as React from 'react';
import Grid from '@mui/material/Grid';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import FolderIcon from '@mui/icons-material/Folder';
import { TeamsProps } from '@/app/component/interfaces';
import Snackbar from "../../component/Snackbar";
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
//To DO: import CreateUpdateForm from './CreateUpdateForm';

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
  }: TeamsProps
) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          {/*To Do <CreateUpdateForm
          loading={loading}
          showMessage={showMessage}
          setShowMessage={setShowMessage}
          message={message}
          messageColor={messageColor}
          onSubmit={submit}
          formHandleSubmit={handleSubmit}
          register={register}
          errors={errors}/> */}
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You can collaborate and share with others by creating new team.
            </DialogContentText>
          </DialogContent>
          <DialogContent>
            <form noValidate>
              <Grid item xs={25}>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="teamname"
                  label="Team Name"
                  type="text"
                  fullWidth
                  {...register("teamname")}
                  error={Boolean(errors?.teamname)}
                  helperText={errors?.teamname ? errors?.teamname.message : " "}
                />
                <Button className="mr-1 text-black">
                  <FolderIcon className="mr-1 text-black" />
                  File Upload for avatar
                </Button>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              onClick={formHandleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
        {teams.map((team: any) => (
        <List>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar className="bg-tertiary">{team.team_name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText className="mt-5 font-bold text-black">
              {team.team_name}
            </ListItemText>
            <Button
              className="ml-24 mt-1 mb-1 mr-2 text-black"
              variant="outlined"
            >
              Switch
            </Button>
            <Button
              className="ml-2 mt-1 mb-1 text-black"
              variant="outlined"

            > 
            <Link href={`/teams/${team.team_id}`}>
                View
            </Link>
            </Button>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
        ))}
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