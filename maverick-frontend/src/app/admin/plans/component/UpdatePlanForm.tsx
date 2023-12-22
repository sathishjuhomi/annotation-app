"use client";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { UpdatePlanProps } from '@/app/component/interfaces';
import Snackbar from '@/app/component/Snackbar';

export default function UpdatePlanForm(
    {
      loading,
      showMessage,
      setShowMessage,
      message,
      messageColor,
      onSubmitPlan,
      formHandleSubmitPlan,
      register,
      errors,
      open,
      setOpen,
      planName,
      description,
    }: UpdatePlanProps
) {

    const handleClose = () => {
        setOpen(false);
        location.reload()
    };

    return (
        <div>
            <Dialog className='rounded-md' open={open} onClose={handleClose}>
                <DialogTitle className='ml-6 mr-8 mt-8 text-2xl text-black font-Inter font-bold'>Update Plan</DialogTitle>
                <DialogContentText className='ml-12 mr-8 text-greyplus text-sm font-Inter font-normal leading-6'>
                    You can update your plan name and description here
                </DialogContentText>
                <DialogContent>
                    <form onSubmit={formHandleSubmitPlan(onSubmitPlan)} noValidate>
                        <Grid className='mt-2'>
                            <TextField
                                autoFocus
                                required
                                className='w-full-six h-20 ml-6 border-greyplus'
                                margin="dense"
                                id="planName"
                                label="Plan Name"
                                type="text"
                                defaultValue={planName}
                                {...register("planName")}
                                error={Boolean(errors?.planName)}
                                helperText={errors?.planName ? errors?.planName.message : " "}
                            />
                            <TextField
                                className='w-full-six h-20 ml-6 border-greyplus'
                                margin="dense"
                                id="description"
                                label="Description"
                                type="text"
                                defaultValue={description}
                                {...register("description")}
                                error={Boolean(errors?.description)}
                                helperText={errors?.description ? errors?.description.message : " "}
                            />
                            <DialogActions>
                                <Button
                                    className="w-28 h-11 text-white font-Inter font-bold leading-6 normal-case bg-git hover:bg-lightblack"
                                    onClick={handleClose}>Cancel</Button>
                                <Button
                                    className='w-28 h-11 mr-1 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen'
                                    variant='contained'
                                    type="submit"
                                    onClick={formHandleSubmitPlan(onSubmitPlan)}
                                >
                                    Update
                                </Button>
                            </DialogActions>
                        </Grid>
                    </form>
                </DialogContent>
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
                    className="text-greyplus mt-2 flex justify-center items-center"
                >
                    <CircularProgress color="inherit" className='mt' />
                </Box>
            ) : null}
        </div>
    );
}