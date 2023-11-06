"use client";
import * as React from 'react';
import Button from '@mui/material/Box';
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { DeleteTeamProps } from '@/app/component/interfaces';
import Snackbar from '@/app/component/Snackbar';
import Delete from '@/app/component/Delete.jpg';
import Image from 'next/image';

export default function DeleteTeam(
    {
        loading,
        showMessage,
        setShowMessage,
        message,
        messageColor,
        open,
        setOpen,
        teamId,
        teamTitle,
        handleDeleteTeam,
    }: DeleteTeamProps
) {

    const handleCloseDeleteTeam = () => {
        setOpen(false);
    };


    return (
        <div>
            <Dialog open={open} onClose={handleCloseDeleteTeam}>
                <DialogContent className='ml-6 mr-10 mt-8'>
                    <DialogContentText className="ml-36 mr-12 text-2xl text-black font-Inter font-bold">
                        Are you sure you want to
                    </DialogContentText>
                    <DialogContentText className="ml-36 mr-12 text-2xl text-black font-Inter font-bold">
                        delete the Team <span className="uppercase"> {teamTitle}</span>
                    </DialogContentText>
                    <DialogContentText className='ml-36 text-greyplus text-sm font-Inter font-normal leading-6'>
                        It will impact all the members of the team
                    </DialogContentText>
                    <div className="flex flex-row -mt-28">
                        <Image
                            src={Delete}
                            alt='Delete'
                            className="w-24 h-24 mt-11"
                            quality={100}
                            placeholder='blur'
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        className='w-20 h-11 mr-1 mb-14 rounded-md text-white font-Inter font-bold leading-6 normal-case bg-git hover:bg-lightblack hover:border-black'
                        onClick={handleCloseDeleteTeam}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        No
                    </Button>
                    <Button
                        className="w-20 h-11 mr-10 mb-14 rounded-md text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onClick={() => handleDeleteTeam(teamId)}
                    >
                        Yes
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
                <Box
                    className="text-greyplus mt-2 flex justify-center items-center"
                >
                    <CircularProgress color="inherit" />
                </Box>
            ) : null}

        </div>
    )

}