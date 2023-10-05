"use client";
import * as React from 'react';
import Button from "@mui/material/Button";
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
import { SignUpProps, TeamsProps } from '@/app/component/interfaces';
import Snackbar from "../../component/Snackbar";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function CreateOrUpdate(
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
    }: SignUpProps
) {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
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
        </div >
  )
}