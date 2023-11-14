"use client";
import { Box } from "@mui/material";
import * as React from "react";
import SubscriptionForm from "./component/SubscriptionForm";
import NavBar from "../component/NavBar";

const Subscriptions = () => {
    return (
        <Box className="flex">
            {/* <NavBar></NavBar> */}
            <Box component="main" className="mt-4 mb-4"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <SubscriptionForm/>
            </Box>
        </Box>
    )

};

export default Subscriptions;