"use client";
import { Button, Paper, Typography } from "@mui/material";
import * as React from "react";
import NavBar from "../../component/NavBar";
import Box from "@mui/material/Box";
import { AcceptTeamInviteProps } from "../../component/interfaces";
import Snackbar from "../../component/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter, useSearchParams } from "next/navigation";
import { getMemberDetail } from "../api/route";

export default function acceptTeamInvitation(
    {
        loading,
        showMessage,
        setShowMessage,
        message,
        messageColor,
        onSubmit,
    }: AcceptTeamInviteProps
) {
    const router = useRouter();
    const handleDeclineClick = () => {
        router.push("/docs/installation");
    };

    const params = useSearchParams();
    const invite_token = params.get('token')
    const response = getMemberDetail( invite_token )
    console.log("ReSPONSE_INVITAION_DETAILS: ", response)
    return (
        <Box className="flex">
            <NavBar></NavBar>
            <Box component="main" className="mt-10"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <Paper className="mt-4 ml-2 mr-2">
                    <br></br>
                    <Typography className="text-black font-bold text-xl ml-5">Join the Team</Typography>
                    <br></br>
                    <Typography className="text-black ml-5">
                        jayabharathi@juhomi.com invited you to the team
                    </Typography>
                    <br></br>
                    <Button
                        type="submit"
                        className="text-white ml-5 bg-primary mb-2 mt-2"
                        variant="contained"
                        onClick= {onSubmit}
                    >
                        Accept
                    </Button>
                    <Button
                        className="ml-5 mb-2 mt-2"
                        variant="outlined"
                        onClick={handleDeclineClick}
                    >
                        Decline
                    </Button>
                    <br></br>
                </Paper>
            </Box>
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