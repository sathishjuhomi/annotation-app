"use client";
import { Button, Paper, Typography } from "@mui/material";
import * as React from "react";


const acceptTeamInvite = () => {
    return(
        <div className="align-center">
            <Paper>
                <br></br>
                <Typography className="text-black font-bold ml-5">Join the Team</Typography>
                <br></br>
                <Typography className="text-black ml-5">
                    jayabharathi@juhomi.com invited you to the team
                </Typography>
                <br></br>
                <Button
                className="text-white ml-5 bg-primary mb-2"
                variant="contained"
                >
                    Accept
                </Button>
                <Button
                className="ml-5 mb-2"
                variant="outlined"
                >
                    Cancle
                </Button>
            </Paper>
        </div>
    )
};
export default acceptTeamInvite