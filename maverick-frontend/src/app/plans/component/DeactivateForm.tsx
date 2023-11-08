"use client";
import * as React from 'react';
import Button from '@mui/material/Box';
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { DeactivateProps } from '@/app/component/interfaces';
import Snackbar from '@/app/component/Snackbar';


export default function Deactivate(
    {
        loading,
        showMessage,
        setShowMessage,
        message,
        messageColor,
        handleDeactivate,
        open,
        setOpen,
        priceId,
        planName
    }: DeactivateProps
) {

    const handleClose = () => {
        setOpen(false);
    };

    console.log("Deactivate PriceId: ", priceId)

    return (
        <div>
            <Dialog className='rounded-md' open={open} onClose={handleClose}>
                <DialogContent className="ml-4 mr-22">
                    <Box className='ml-4'>
                        <DialogContentText className='ml-3 mr-10 mt-1 text-2xl text-black font-Inter font-bold leading-8'>
                            Are you sure you want to 
                        </DialogContentText>
                        <DialogContentText className='ml-3 mr-3 text-2xl text-black font-Inter font-bold leading-8'>
                            Dectivate the plan <span className="capitalize text-2xl text-black font-Inter leading-8 font-normal"> {planName}</span>
                        </DialogContentText>
                        <DialogContentText className='ml-4 mr-42 mt-2 text-greyplus text-sm font-Inter font-normal leading-6'>
                            It will impact all the status of the plan
                        </DialogContentText>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <div className='flex flex-row'>
                        <Button
                            onClick={handleClose}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            className="w-20 h-11 mr-1 mb-10 text-white font-Inter font-bold leading-6 normal-case bg-git hover:bg-lightblack hover:border-black"
                        >
                            No
                        </Button>
                        <Button
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            className="w-20 h-11 mr-10 mb-10 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen"
                            onClick={() => handleDeactivate(priceId)}
                        >
                            Yes
                        </Button>
                    </div>
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
                <Box
                    className="text-greyplus mt-auto flex justify-center items-center"
                >
                    <CircularProgress color="inherit" />
                </Box>
            ) : null}

        </div>
    )

}