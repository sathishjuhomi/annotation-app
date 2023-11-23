"use client";
import { Box } from "@mui/material";
import * as React from "react";
import SubscriptionForm from "./component/SubscriptionForm";
import AdminNavBar from "../component/AdminNavBar";

const Subscriptions = () => {
    return (
        <Box className="flex mt-2">
            <AdminNavBar></AdminNavBar>
            <Box component="main" className="mt-4 mb-4"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <SubscriptionForm/>
            </Box>
        </Box>
    )

};

export default Subscriptions;