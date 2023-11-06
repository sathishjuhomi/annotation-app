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
        async function fetchData() {
            const { props } = await getMemberDetail(invite_token)
            try {
                setTeamDetail(props.getMember)
            } catch (error) {
                const data = props.getMember.detail;
                setShowMessage(data);
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
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
                        className="ml-5 mb-6 mt-2 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen"
                        variant="contained"
                        onClick={onSubmit}
                    >
                        Accept
                    </Button>
                    <Button
                        className="ml-5 mb-6 mt-2 text-red border-red font-Inter font-bold leading-6 normal-case bg-white hover:border-red"
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
                <Box
                    className='text-greyplus mt-2 text-greyplus mt-2 flex justify-center items-center'
                >
                    <CircularProgress color="inherit" />
                </Box>
            ) : null}
        </Box>
    );
}