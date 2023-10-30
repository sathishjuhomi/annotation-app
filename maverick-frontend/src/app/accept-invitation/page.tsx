"use client";
import * as React from "react";
import * as Constants from "../utils/constant";
import { useSearchParams } from 'next/navigation';
import AcceptInvitation from "./component/AcceptInvitation";
import { useRouter } from "next/navigation";
import { acceptTeamInvite, declineTeamInvite } from "../teams/api/route";
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
        if (accessToken === null || accessToken === "") {
            router.push("/signup");
        };
    }, []);

    const onAcceptTeamInvite = async (inviteToken: any) => {
        setShowMessage(true);
        setLoading(true);
        const {props} = await acceptTeamInvite(inviteToken)
        try{
              const data = props.acceptInvite.detail;
              setMessage(data);
              setMessageColor(Constants.SUCCESS);
              router.push("/teams");
            setLoading(false);
          } catch (error) {
            const data = props.acceptInvite.detail;
            setMessage(data);
            setMessageColor(Constants.ERROR);
            console.error('Error fetching data:', error);
          }
      };

    const inviteTokenDecline = params.get('token')

    const onDeclineTeamInvite = async (inviteToken: any) => {
        setShowMessage(true);
        setLoading(true);
        const {props} = await declineTeamInvite(inviteToken)
        try{
              const data = props.declineInvite.detail;
              setMessage(data);
              setMessageColor(Constants.SUCCESS);
              router.push("/teams");
            setLoading(false);
          } catch (error) {
            const data = props.declineInvite.detail;
            setMessage(data);
            setMessageColor(Constants.ERROR);
            console.error('Error fetching data:', error);
          }
      };

    return (
        <AcceptInvitation
            loading={loading}
            showMessage={showMessage}
            setShowMessage={setShowMessage}
            message={message}
            messageColor={messageColor}
            onSubmit={onAcceptTeamInvite}
            declineInviteTeam={onDeclineTeamInvite}
        />
    )
};
export default acceptTeamInvitation;