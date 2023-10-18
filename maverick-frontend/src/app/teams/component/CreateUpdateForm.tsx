"use client";
import * as React from 'react';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import FolderIcon from '@mui/icons-material/Folder';
import { CreateUpdateProps} from '@/app/component/interfaces';
import Snackbar from "../../component/Snackbar";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import * as Constants from "../../utils/constant";

export default function CreateOrUpdateForm(
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
        open,
        setOpen,
        teamTitle,
    }: CreateUpdateProps
) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{teamTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You can collaborate and share with others by {teamTitle === Constants.CREATE_TEAM ? "creating" : "updating"} new team.
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
                                defaultValue={teamTitle === Constants.CREATE_TEAM ? "" : teamTitle}
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
                        {teamTitle === Constants.CREATE_TEAM ? "Create" : "Update"}
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