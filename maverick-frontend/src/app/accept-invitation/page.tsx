"use client";
import * as React from "react";
import * as Constants from "../utils/constant";
import { useSearchParams } from 'next/navigation';
import { acceptTeamInvite } from "./api/route";
import AcceptInvitation from "./component/AcceptInvitation";
import { useRouter } from "next/navigation";
import { declineTeamInvite } from "../teams/api/route";
import { useEffect } from 'react';

const acceptTeamInvitation = () => {
    const [loading, setLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);

    const router = useRouter();
    const params = useSearchParams();
    const inviteToken = params.get('token');

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        console.log("Acess token invite page: ", accessToken);
        if (accessToken === null || accessToken === "") {
            console.log("Acess token invite page inside if: ", accessToken);
            router.push("/signup");
        };
    }, []);

    const submit = async () => {
        setShowMessage(true);
        setLoading(true);
        const response = await acceptTeamInvite(inviteToken)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    setMessage(response.message);
                    setMessageColor(Constants.SUCCESS);
                    router.push("/teams");
                } else {
                    const data = response.detail;
                    setMessage(data);
                    setMessageColor(Constants.ERROR);
                }
                setLoading(false);
            })
            .catch((error) => {
                setMessage(error);
                setLoading(false);
                setMessageColor(Constants.ERROR);
            });
    };

    const inviteTokenDecline = params.get('token')

    const declineInviteTeam = async () => {
        setShowMessage(true);
        setLoading(true);
        const response = await declineTeamInvite(inviteTokenDecline)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    setMessage(response.message);
                    setMessageColor(Constants.SUCCESS);
                    router.push("/teams");
                } else {
                    const data = response.detail;
                    setMessage(data);
                    setMessageColor(Constants.ERROR);
                }
                setLoading(false);
            })
            .catch((error) => {
                setMessage(error);
                setLoading(false);
                setMessageColor(Constants.ERROR);
            });
    };


    return (
        <AcceptInvitation
            loading={loading}
            showMessage={showMessage}
            setShowMessage={setShowMessage}
            message={message}
            messageColor={messageColor}
            onSubmit={submit}
            declineInviteTeam={declineInviteTeam}
        />
    )
};
export default acceptTeamInvitation;