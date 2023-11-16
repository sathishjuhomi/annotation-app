"use client"
import { UpgradePlanProps } from "@/app/component/interfaces";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { upgradePlan } from "../api/route";
import * as Constants from "../../utils/constant";

const UpgradePlanForm = (
    {
        open,
        setOpen,
        plans,
        teamId
    }: UpgradePlanProps
) => {
    const handleClose = () => {
        setOpen(false);
    };
    const [selectedPriceId, setSelectedPriceId] = React.useState('');
    const [selectedPaymentType, setSelectedPaymentType] = React.useState('');
    const [upgradeLoading, setUpgradeLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);

    const handleUpgrade = async (teamId: string, priceId: string, paymentType: string) => {
        setSelectedPriceId(priceId);
        setSelectedPaymentType(paymentType);
        setShowMessage(true);
        setUpgradeLoading(true);
        const { props } = await upgradePlan(teamId, priceId, paymentType)
        const data = props.data
        try {
            if (props && props.data) {
                setUpgradeLoading(false);
                window.location.href = data.url
            } else {
                const errorMessage = data.detail;
                setMessage(errorMessage);
                setMessageColor(Constants.ERROR);
            }
        }
        catch (error) {
            const errorMessage = props.data.detail;
            console.error('Error fetching data:', error);
            setMessage(errorMessage);
            setMessageColor(Constants.ERROR);
        }
    };

    return (
        <Dialog className='rounded-md' open={open} onClose={handleClose}>
            <Paper className="flex flex-wrap bg-grey flex-basis-30%">
                {plans.length > 0 ? plans.map((plan: any, index: number) => (
                    <Card
                        key={index}
                        className="m-2 flex flex-col justify-between"
                    >
                        <CardContent>
                            <Typography className="mb-3 capitalize text-xl text-black font-Inter font-bold">
                                {plan.plan.plan_name}
                            </Typography>
                            <Typography
                                className="mt-auto mb-2 normal-case text-greyplus text-sm font-Inter font-normal leading-6"
                                variant="body2"
                            >
                                {plan.plan.description === null ?
                                    'No description has specified'
                                    : plan.plan.description}
                            </Typography>
                            <Typography
                                className="mt-auto text-2xl text-black font-Inter font-bold"
                            >
                                {plan.price.currency} {plan.price.price}
                                <span className="text-base text-greyplus font-Inter font-thin">
                                    {plan.price.payment_type === 'one_time' ? " "
                                        : ` /${plan.price.interval_count > 1 ? `${plan.price.interval_count} ${plan.price.billing_period}s`
                                            : `${plan.price.interval_count} ${plan.price.billing_period}`} `}
                                </span>
                                <br />
                                <p className="text-base text-greyplus font-Inter font-thin">
                                    {plan.price.payment_type === 'one_time' ? "One-time billing"
                                        : 'Billed recursively'}
                                </p>
                            </Typography>
                        </CardContent>
                        <CardActions className="mt-auto">
                            <Button
                                className='w-full h-11 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen'
                                variant='contained'
                                type="submit"
                                size="small"
                                onClick={() => handleUpgrade(teamId, plan.price_id, plan.price.payment_type)}
                            >
                                Buy Plan
                            </Button>
                        </CardActions>
                    </Card>
                )) : null
                }
            </Paper>
        </Dialog>
    )
}
export default UpgradePlanForm