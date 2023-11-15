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


const UpgradePlanForm = (
    {
        // loading,
        // showMessage,
        // setShowMessage,
        // message,
        // messageColor,
        open,
        setOpen,
        plans,
        // handleUpgrade,
    }: UpgradePlanProps
) => {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog className='rounded-md' open={open} onClose={handleClose}>
            <Paper className=" flex flex-row bg-grey justify-between">
                {plans.length > 0 ? plans.map((plan: any) => (
                    <Card className="w-64 max-h-72 m-2 flex flex-col justify-between">
                        <CardContent>
                            <Typography className="mb-3 capitalize text-xl text-black font-Inter font-bold">
                                {plan.plan.plan_name}
                            </Typography>
                            <Typography
                                className="mt-auto normal-case text-greyplus text-sm font-Inter font-normal leading-6"
                                variant="body2"
                            >
                                {plan.plan.description === null ? 
                                'No description has specified' 
                                : plan.plan.description}
                            </Typography>
                            <Typography
                                className="mt-10 text-2xl text-black font-Inter font-bold"
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