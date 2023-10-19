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
import { useEffect } from "react";

export default function acceptTeamInvitation(
    {
        loading,
        showMessage,
        setShowMessage,
        message,
        messageColor,
        onSubmit,
        declineInviteTeam,
    }: AcceptTeamInviteProps
) {
    const router = useRouter();

    const params = useSearchParams();
    const invite_token = params.get('token')
    const [teamDetail, setTeamDetail] = React.useState(null)

    useEffect(() => {
        const response = getMemberDetail(invite_token)
        .then(async (res) => {
            const response = await res.json()
            if (res.status === 200){
                setTeamDetail(response)
            }
        })
    }, []);

    return (
        <Box className="flex">
            <NavBar></NavBar>
            <Box component="main" className="mt-10"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <Paper className="mt-4 ml-2 mr-2">
                    <br></br>
                    <Typography className="text-black font-bold text-xl ml-5">Join the {teamDetail !== null ? teamDetail['team_name'] : ""}</Typography>
                    <br></br>
                    <Typography className="text-black ml-5">
                    {teamDetail !== null ? teamDetail['invited_by'] : ""} invited you to the team
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
                        onClick={declineInviteTeam}
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