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
import DeleteTeamForm from './DeleteForm';
import { deleteTeam } from '../api/route';

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
        teamId,
    }: CreateUpdateProps
) {

    const handleClose = () => {
        setOpen(false);
    };

    const router = useRouter();

    const [openDeleteTeam, setOpenDeleteTeam] = React.useState(false);
    const handleClickOpenDeleteTeam = () => {
        setOpenDeleteTeam(true);
    };

    const handleDeleteTeam = async (teamId: string) => {
        try {
            const { props } = await deleteTeam(teamId);

            if (props && props.delete) {
                location.reload()
                return {
                    success: true,
                    message: Constants.TEAM_DELETED_SUCCESSFULLY,
                    messageColor: Constants.SUCCESS,
                };
            } else {
                const data = props.delete.detail;
                return {
                    success: false,
                    message: data,
                    messageColor: Constants.ERROR,
                };
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return {
                success: false,
                message: 'An error occurred while deleting the team.',
                messageColor: Constants.ERROR,
            };
        }
    };

    return (
        <div>
            <Dialog className='rounded-md' open={open} onClose={handleClose}>
                <DialogTitle className='ml-6 mr-8 mt-8 text-2xl text-black font-Inter font-bold'>{teamTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText className='ml-6 mr-8 -mt-1 -mb-2 text-greyplus text-sm font-Inter font-normal leading-6'>
                        You can collaborate and share with others by {teamTitle === Constants.CREATE_TEAM ? "creating" : "updating"} new team
                    </DialogContentText>
                </DialogContent>
                <DialogContent>
                    <form noValidate>
                        <Grid item xs={25}>
                            <TextField
                                autoFocus
                                required
                                style={{ textAlign: 'center' }}
                                className='w-full-six h-20 -mt-2 ml-6 border-greyplus'
                                margin="dense"
                                id="teamname"
                                label="Team Name"
                                type="text"
                                defaultValue={teamTitle === Constants.CREATE_TEAM ? null : teamTitle}
                                {...register("teamname")}
                                error={Boolean(errors?.teamname)}
                                helperText={errors?.teamname ? errors?.teamname.message : " "}
                            />
                            <TextField
                                className='w-full-six h-20 ml-6 mb-6 border-greyplus'
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
                        ? null : 
                        <div>
                            <Button
                                className='mr-36 -mt-24 text-black font-Inter font-bold leading-6 normal-case bg-white hover:text-red hover:bg-white'
                                onClick={handleClickOpenDeleteTeam}
                            >
                                Delete Team
                            </Button>
                            <div>
                                <DeleteTeamForm
                                    loading={loading}
                                    showMessage={showMessage}
                                    setShowMessage={setShowMessage}
                                    message={message}
                                    messageColor={messageColor}
                                    open={openDeleteTeam}
                                    setOpen={setOpenDeleteTeam}
                                    teamTitle={teamTitle}
                                    teamId={teamId}
                                    handleDeleteTeam={handleDeleteTeam}
                                />
                            </div>
                        </div>
                    }
                    <Button
                        className="w-28 h-11 -mt-24 text-white font-Inter font-bold leading-6 normal-case bg-git hover:bg-lightblack"
                        onClick={handleClose}>Cancel</Button>
                    <Button
                        className='w-32 h-11 -mt-24 mr-8 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen'
                        variant='contained'
                        type="submit"
                        onClick={formHandleSubmit(onSubmit)}
                    >
                        {teamTitle === Constants.CREATE_TEAM ? "Create" : "Update"}
                    </Button>
                </DialogActions>
                <br></br>
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
                <Box
                    className="text-greyplus flex justify-center items-center"
                >
                    <CircularProgress color="inherit" className='mt-4'/>
                </Box>
            ) : null}
        </div >
    )
}