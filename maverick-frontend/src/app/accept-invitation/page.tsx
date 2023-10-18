"use client";
import * as React from "react";
import * as Constants from "../utils/constant";
import { useSearchParams } from 'next/navigation';
import { acceptTeamInvite } from "./api/route";
import AcceptInvitation from "./component/AcceptInvitation";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const acceptTeamInvitation = () => {
    const [loading, setLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);

    const router = useRouter();
    const params = useSearchParams();
    const invite_token = params.get('token')
    const team_member_id = params.get('team_id')
    const invitee_email = params.get('email_to')

    console.log("invite_token", invite_token)
    console.log("team_member_id", team_member_id)
    console.log("emailinvite", invitee_email)

    const submit = async () => {
        setShowMessage(true);
        setLoading(true);
        const response = await acceptTeamInvite(invite_token, team_member_id,  invitee_email)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    setMessage(response.message);
                    setMessageColor(Constants.SUCCESS);
                    router.push("/docs/installation");
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
        />
    )
};
export default acceptTeamInvitation;