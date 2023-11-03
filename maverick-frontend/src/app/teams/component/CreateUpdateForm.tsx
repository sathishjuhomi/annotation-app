"use client";
import * as React from 'react';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import { useRouter } from "next/navigation";
import { CreateUpdateProps } from '@/app/component/interfaces';
import Snackbar from "../../component/Snackbar";
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import * as Constants from "../../utils/constant";
import { InputAdornment, Typography } from '@mui/material';
import ViewTeamAndTeamMembers from './ViewTeamMembers';

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

    const router = useRouter();

    
    // const handleClickOpenDeleteTeam = (id: any) => {
    //     console.log("Team Id:", id)
    // };

    return (
        <div>
            <Dialog className='rounded-md' open={open} onClose={handleClose}>
                <DialogTitle className='ml-3 mr-3 mt-8 text-2xl text-black font-Inter font-bold'>{teamTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText className='ml-4 mr-4 -mt-1 text-greyplus text-sm font-Inter font-normal leading-6'>
                        You can collaborate and share with others by {teamTitle === Constants.CREATE_TEAM ? "creating" : "updating"} new team
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <form noValidate>
                        <Grid item xs={25}>
                            <TextField
                                autoFocus
                                required
                                className='w-full h-20 p-3 -mt-6 border-greyplus'
                                margin="dense"
                                id="teamname"
                                label="Team Name"
                                type="text"
                                defaultValue={teamTitle === Constants.CREATE_TEAM ? "" : teamTitle}
                                {...register("teamname")}
                                error={Boolean(errors?.teamname)}
                                helperText={errors?.teamname ? errors?.teamname.message : " "}
                            />
                            <TextField
                                autoFocus
                                required
                                className='w-full h-28 p-3 border-greyplus'
                                margin="dense"
                                id="avatar"
                                label="File Upload for avatar"
                                type="text"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end" className='text-green'>Browse</InputAdornment>,
                                }}
                            />
                        </Grid>
                    </form>
                    <br></br>
                </DialogContent>
                <DialogActions>
                    {teamTitle === Constants.CREATE_TEAM
                        ? null
                        : <Button
                            className='mr-auto ml-8 -mt-24 text-black font-Inter font-bold leading-6 normal-case bg-white hover:text-red'
                            // onClick={() => { handleClickOpenDeleteTeam(teamId) }}
                        >
                            Delete Team
                        </Button>
                    }
                    <Button
                        className="w-28 h-11 -mt-24 text-white font-Inter font-bold leading-6 normal-case bg-git hover:bg-lightblack"
                        onClick={handleClose}>Cancel</Button>
                    <Button
                        className='w-32 h-11 -mt-24 mr-6 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen'
                        variant='contained'
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