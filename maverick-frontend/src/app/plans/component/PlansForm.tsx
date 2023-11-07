"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/navigation";
import CreatePlanForm from './CreatePlanForm';
import { PlansProps } from '@/app/component/interfaces';
import Snackbar from '@/app/component/Snackbar';

export default function PlansList(
    {
        loading,
        showMessage,
        setShowMessage,
        message,
        messageColor,
        onSubmit,
        formHandleSubmit,
        register,
        errors,
        plans,
    }: PlansProps
) {


    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    console.log("PlansFOrm: ")

    return (
        <Box className="mt-10 w-full mr-4">
            <div className="flex justify-between pb-5">
                <Typography className="text-left font-Inter font-bold leading-7 text-xl ml-2">Plans</Typography>
                <Button
                    size="small"
                    variant="contained"
                    className="w-28 h-11 ml-auto normal-case font-Inter font-normal font-bold text-sm text-white bg-button hover:bg-lightgreen"
                    onClick={handleClickOpen}
                >
                    Create Plan
                </Button>
                <CreatePlanForm
                    loading={loading}
                    showMessage={showMessage}
                    setShowMessage={setShowMessage}
                    message={message}
                    messageColor={messageColor}
                    onSubmit={onSubmit}
                    formHandleSubmit={formHandleSubmit}
                    register={register}
                    errors={errors}
                    open={open}
                    setOpen={setOpen}
                />
            </div>

            <Box className=' bg-white m-1'>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead className=' mt-2 mb-2'>
                            <TableRow>
                                <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                    Name
                                </TableCell>
                                <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                    Description
                                </TableCell>
                                <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                    Price
                                </TableCell>
                                <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                    Currency
                                </TableCell>
                                <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                    Payment Mode
                                </TableCell>
                                <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                    Payment Type
                                </TableCell>
                                <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                    Billing Period
                                </TableCell>
                                <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                    Interval Count
                                </TableCell>
                                <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                    Active
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plans.length > 0 ? plans.map((plan: any) => (
                                <TableRow key={plans.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.plan.plan_name}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.plan.description}
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        {plan.price.price}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.price.currency}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.price.payment_mode}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.price.payment_type}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.price.billing_period}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.price.interval_count}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.is_active ? 'True' : 'False'}
                                    </TableCell>
                                </TableRow>
                            )) : <Box>
                                <Typography className='text-center mt-10 mb-2'> No Plans </Typography>
                                <br />
                            </Box>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {
                message !== "" ? (
                    <Snackbar
                        showMessage={showMessage}
                        setShowMessage={setShowMessage}
                        message={message}
                        messageColor={messageColor}
                    />
                ) : null
            }
            {
                loading ? (
                    <Box
                        className="text-greyplus mt-auto flex justify-center items-center"
                    >
                        <CircularProgress color="inherit" />
                    </Box>
                ) : null
            }
        </Box>
    )
}