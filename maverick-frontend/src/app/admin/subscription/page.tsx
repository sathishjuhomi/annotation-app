"use client";
import { Box } from "@mui/material";
import * as React from "react";
import SubscriptionForm from "./component/SubscriptionForm";
import * as Constants from "../../utils/constant";
import { useEffect } from "react";
import { subscriptionList } from "./api/route";
import AdminNavBar from "../component/AdminNavBar";

const Subscriptions = () => {

    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);
    const [subscriptions, setSubscriptions] = React.useState([]);

    useEffect(() => {
        async function fetchData() {
            const { props } = await subscriptionList();
            try {
                setSubscriptions(props.data);
            } catch (error) {
                const data = props.data.detail;
                setMessage(data);
                setMessageColor(Constants.ERROR);
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <Box className="flex mt-2">
            <AdminNavBar/>
            <Box component="main" className="mt-4 mb-4"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <SubscriptionForm
                    subscriptions={subscriptions}
                />
            </Box>
        </Box>
    )

};

export default Subscriptions;