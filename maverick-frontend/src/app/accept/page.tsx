"use client";
import { Button, Paper, Typography } from "@mui/material";
import * as React from "react";
import NavBar from "../component/NavBar";
import Box from "@mui/material/Box";

const acceptTeamInvite = () => {
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
                            className="text-white ml-5 bg-primary mb-2 mt-2"
                            variant="contained"
                        >
                            Accept
                        </Button>
                        <Button
                            className="ml-5 mb-2 mt-2"
                            variant="outlined"
                        >
                            Decline
                        </Button>
                        <br></br>
                    </Paper>
                </Box>
            </Box>
    )
};
export default acceptTeamInvite