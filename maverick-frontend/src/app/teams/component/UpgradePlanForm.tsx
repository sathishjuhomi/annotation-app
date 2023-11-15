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
                <Card className="w-64 max-h-72 m-2 flex flex-col justify-between">
                    <CardContent>
                        <Typography className="mb-3 text-xl text-black font-Inter font-bold">
                            Monthly Plan
                        </Typography>
                        <Typography
                            className="mt-auto text-greyplus text-sm font-Inter font-normal leading-6"
                            variant="body2"
                        >
                            Team subscrpiton
                        </Typography>
                        <Typography
                            className="mt-10 text-3xl text-black font-Inter font-bold"
                        >
                            $ 250 <span className="text-base text-greyplus font-Inter font-thin">/ 2 months </span>
                            <br />
                            <p className="text-base text-greyplus font-Inter font-thin">
                                {'Billed recursively'}
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
                <Card className="w-64 max-h-72 m-2 flex flex-col justify-between">
                    <CardContent>
                        <Typography className="mb-3 text-xl text-black font-Inter font-bold">
                            Elite One-Time Plan
                        </Typography>
                        <Typography
                            className="mt-auto text-greyplus text-sm font-Inter font-normal leading-6"
                            variant="body2"
                        >
                            Team subscrpiton
                        </Typography>
                        <Typography className="mt-10 text-3xl text-black font-Inter font-bold">
                            $ 750
                            <br />
                            <p className="text-base text-greyplus font-Inter font-thin">
                                {'One-time billing'}
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
            </Paper>
        </Dialog>
    )
}
export default UpgradePlanForm