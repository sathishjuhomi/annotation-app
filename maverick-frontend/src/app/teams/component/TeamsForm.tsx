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
import Link from '@mui/material/Link';

const defaultTheme = createTheme();

export default function TeamList() {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box className="mt-4 w-full mr-4">
      <Paper elevation={3} className="ml-2">
        <br></br>
        <div className="flex justify-between">
          <Typography className="mt-0 ml-4 text-left font-bold text-xl">Teams</Typography>
          <Button
            size="small"
            variant="contained"
            className="text-white bg-primary mr-5"
            onClick={handleClickOpen}
          >
            Create Team
          </Button>
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
            <Button onClick={handleClose}>Create</Button>
          </DialogActions>
        </Dialog>
        <List>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar className="bg-tertiary">J</Avatar>
            </ListItemAvatar>
            <ListItemText className="mt-5 font-bold text-black">
              Jayabharathi
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
              View
            </Button>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar className="bg-tertiary">M</Avatar>
            </ListItemAvatar>
            <ListItemText className="mt-5 font-bold text-black">
            <Link href="/view"  className="text-black">
              Maverick
            </Link>
              {/* Maverick */}
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
              <Link href="/view"  className="text-black">
                View
              </Link>
            </Button>
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      </Paper>
    </Box>
  );
}