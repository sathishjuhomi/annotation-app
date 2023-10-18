"use client";
import * as React from "react";
import * as Constants from "../utils/constant";
import { useSearchParams } from 'next/navigation';
import { acceptTeamInvite } from "./api/route";
import AcceptInvitation from "./component/AcceptInvitation";
import { useRouter } from "next/navigation";
import { declineTeamInvite } from "../teams/api/route";

const acceptTeamInvitation = () => {
    const [loading, setLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);

    const router = useRouter();
    const params = useSearchParams();
    const invite_token = params.get('token')

    console.log("invite_token", invite_token)

    const submit = async () => {
        setShowMessage(true);
        setLoading(true);
        const response = await acceptTeamInvite(invite_token)
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

    const invite_token_decline = params.get('token')

    console.log("invite_token_decline", invite_token_decline)
  
    const declineInviteTeam = async () => {
      setShowMessage(true);
      setLoading(true);
      const response = await declineTeamInvite(invite_token_decline)
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