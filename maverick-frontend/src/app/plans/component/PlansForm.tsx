"use client";
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CircularProgress from '@mui/material/CircularProgress';
import CreatePlanForm from './CreatePlanForm';
import Snackbar from '@/app/component/Snackbar';
import Chip from '@mui/material/Chip';
import { PlansProps, UpdatePlanFormData } from '@/app/component/interfaces';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import UpdatePlanForm from './UpdatePlanForm';
import { updatePlanSchema } from '../validation';
import { ActivatePlan, DeactivatePlan, updatePlan } from '../api/route';
import * as Constants from "../../utils/constant";
import DeactivateForm from './DeactivateForm';
import ActivateForm from './ActivateForm';
import { Switch } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export default function PlansList({
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
}: PlansProps) {
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openActivate, setOpenActivate] = useState(false);
    const [openDeactivate, setOpenDeactivate] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = React.useState('');
    const [selectedPriceId, setSelectedPriceId] = React.useState('');
    const [selectedPlanName, setSelectedPlanName] = React.useState('');
    const [selectedDescription, setSelectedDescription] = React.useState('');
    const [updatePlanLoading, setUpdatePlanLoading] = React.useState(false);
    const [showMessageUpdate, setShowMessageUpdate] = React.useState(false);
    const [messageUpdate, setMessageUpdate] = React.useState("");
    const [messageColorUpdate, setMessageColorUpdate] = React.useState(Constants.INFO);
    const [messageActiveDeactive, setMessageActiveDeactive] = React.useState("");
    const [messageColorActiveDeactive, setMessageColorActiveDeactive] = React.useState(Constants.INFO);
    const [activeLoading, setActiveLoading] = React.useState(false);
    const [deactiveLoading, setDeactiveLoading] = React.useState(false);
    const [showMessageActiveDeactive, setShowMessageActiveDeactive] = React.useState(false);
    const label = {
        inputProps: {
            type: 'checkbox',
            checked: true,
        }
    };

    const GreenSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#0DBE5E',
            '&:hover': {
                backgroundColor: alpha("#15d66e", theme.palette.action.hoverOpacity),
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: "#15d66e",
        },
    }));
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickOpenActive = (priceId: string, planName: string) => {
        setSelectedPriceId(priceId)
        setSelectedPlanName(planName)
        setOpenActivate(true);
    };
    const handleClickOpenDeactivate = (priceId: string, planName: string) => {
        setSelectedPriceId(priceId)
        setSelectedPlanName(planName)
        setOpenDeactivate(true);
    };

    // Update Plan
    const handleClickOpenUpdatePlan = (planId: string, planName: string, description: string) => {
        setSelectedPlanId(planId)
        setSelectedPlanName(planName)
        setSelectedDescription(description)
        setOpenUpdate(true);
    };

    const { register: updatePlanRegister,
        handleSubmit: updatePlanName,
        formState: { errors: updatePlanErrors },
    } = useForm(
        { resolver: yupResolver(updatePlanSchema) }
    )


    const onUpdatePlan = async (data: UpdatePlanFormData) => {
        setShowMessageUpdate(true);
        setUpdatePlanLoading(true);
        const { props } = await updatePlan(selectedPlanId, data);
        try {
            const data = props.update.detail;
            if (props && props.update) {
                setMessageUpdate(data);
                setMessageColorUpdate(Constants.SUCCESS);
                location.reload()
                return {
                    success: true,
                    message: Constants.PLAN_UPDATED_SUCCESSFULLY,
                    messageColor: Constants.SUCCESS,
                };
            } else {
                const data = props.update.detail;
                return {
                    success: false,
                    message: data,
                    messageColor: Constants.ERROR,
                };
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            const data = props.update.detail;
            setMessageUpdate(data);
            setMessageColorUpdate(Constants.ERROR);
            console.error('Error fetching data:', error);
            return {
                success: false,
                message: 'An error occurred while deleting the team.',
                messageColor: Constants.ERROR,
            };
        }
    }
    const handleDeactivatePlan = async () => {
        setShowMessageActiveDeactive(true);
        // setDeactiveLoading(true);
        const { props } = await DeactivatePlan(selectedPriceId);
        try {
            const data = props.deactivate.detail
            if (props && props.deactivate) {
                setMessageActiveDeactive(data);
                setMessageColorActiveDeactive(Constants.SUCCESS);
                location.reload()
                return {
                    success: true,
                    message: Constants.DEACTIVATED_SUCCESSFULLY,
                    messageColor: Constants.SUCCESS,
                };
            } else {
                const data = props.deactivate.detail;
                return {
                    success: false,
                    message: data,
                    messageColor: Constants.ERROR,
                };
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            const data = props.deactivate.detail
            setMessageActiveDeactive(data);
            setMessageColorActiveDeactive(Constants.ERROR);
            return {
                success: false,
                message: 'An error occurred while deleting the team.',
                messageColor: Constants.ERROR,
            };
        }
    };

    const handleActivatePlan = async () => {
        setShowMessageActiveDeactive(true);
        // setActiveLoading(true)
        const { props } = await ActivatePlan(selectedPriceId);
        try {
            const data = props.activate.detail
            if (props && props.activate) {
                setMessageActiveDeactive(data);
                setMessageColorActiveDeactive(Constants.SUCCESS);
                location.reload()
                return {
                    success: true,
                    message: Constants.ACTIVATED_SUCCESSFULLY,
                    messageColor: Constants.SUCCESS,
                };
            } else {
                const data = props.activate.detail;
                return {
                    success: false,
                    message: data,
                    messageColor: Constants.ERROR,
                };
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            const data = props.activate.detail;
            setMessageActiveDeactive(data);
            setMessageColorActiveDeactive(Constants.ERROR);
            return {
                success: false,
                message: 'An error occurred while deleting the team.',
                messageColor: Constants.ERROR,
            };
        }
    };

    return (
        <Box className="mt-10 w-full mr-4">
            <div className="flex justify-between pb-5">
                <Typography className="text-left font-Inter font-bold leading-7 text-xl ml-2">Plans</Typography>
                <Button
                    size="small"
                    variant="contained"
                    color='inherit'
                    className="w-28 h-11 ml-auto mr-2 normal-case font-Inter font-normal font-bold text-sm text-white bg-button hover:bg-lightgreen"
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

            <div className='bg-white m-1'>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead className='mt-2 mb-2'>
                            <TableRow>
                                <TableCell className="text-left font-Inter font-bold leading-6 text-sm">Name</TableCell>
                                <TableCell className="text-left font-Inter font-bold leading-6 text-sm">Description</TableCell>
                                <TableCell className="text-left font-Inter font-bold leading-6 text-sm">Price</TableCell>
                                <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Currency</TableCell>
                                <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Payment Mode</TableCell>
                                <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Payment Type</TableCell>
                                <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Billing Period</TableCell>
                                <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Interval Count</TableCell>
                                <TableCell className="text-center font-Inter font-bold leading-6 text-sm">Status</TableCell>
                                <TableCell align='right'> </TableCell>
                                <TableCell align='left'> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plans.length > 0 ? plans.map((plan: any) => (
                                <TableRow
                                    key={plan.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell className="text-left capitalize font-Inter font-normal leading-6 text-sm">
                                        {plan.plan.plan_name}
                                    </TableCell>
                                    <TableCell className="text-left normal-case font-Inter font-normal leading-6 text-sm">
                                        {plan.plan.description === null ? '-' : plan.plan.description}
                                    </TableCell>
                                    <TableCell className="text-right font-Inter font-normal leading-6 text-sm">
                                        {plan.price.price}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.price.currency}
                                    </TableCell>
                                    <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                        {plan.price.payment_mode}
                                    </TableCell>
                                    <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                        {plan.price.payment_type === 'one_time' ? "One Time" : plan.price.payment_type}
                                    </TableCell>
                                    <TableCell className="text-center capitalize font-Inter font-normal leading-6 text-sm">
                                        {plan.price.billing_period === null ? '-' : plan.price.billing_period}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.price.interval_count === null ? '-' : plan.price.interval_count}
                                    </TableCell>
                                    <TableCell className="text-center font-Inter font-normal leading-6 text-sm">
                                        {plan.is_active ? "Active" : "Inactive"}
                                    </TableCell>
                                    <TableCell align='left'>
                                        <Button
                                            className='text-greyplus hover:text-green hover:bg-white'
                                            onClick={() => handleClickOpenUpdatePlan(plan.id, plan.plan.plan_name, plan.plan.description)}
                                        >
                                            <EditIcon />
                                        </Button>
                                    </TableCell>
                                    <TableCell align='left'>
                                        {plan.is_active ?
                                            <div>
                                                <GreenSwitch {...label}
                                                    defaultChecked
                                                    onChange={() => handleClickOpenActive(plan.price_id, plan.plan.plan_name)}
                                                />
                                                {/* <Chip
                                                    className="w-20 h-8 text-left text-black hover:text-green hover:bg-white capitalize font-Inter font-normal leading-6 text-sm"
                                                    label="Active"
                                                    onClick={() => handleClickOpenActive(plan.price_id, plan.plan.plan_name)}
                                                /> */}
                                                <DeactivateForm
                                                    loading={deactiveLoading}
                                                    showMessage={showMessageActiveDeactive}
                                                    setShowMessage={setShowMessageActiveDeactive}
                                                    message={messageActiveDeactive}
                                                    messageColor={messageColorActiveDeactive}
                                                    handleDeactivate={handleDeactivatePlan}
                                                    open={openActivate}
                                                    setOpen={setOpenActivate}
                                                    priceId={selectedPriceId}
                                                    planName={selectedPlanName}
                                                />
                                            </div>
                                            : <div>
                                                <GreenSwitch {...label}
                                                    onChange={() => handleClickOpenDeactivate(plan.price_id, plan.plan.plan_name)}
                                                />
                                                {/* <Chip
                                                    className="w-20 h-8 text-left text-black hover:text-red hover:bg-white capitalize font-Inter font-normal leading-6 text-sm"
                                                    label="InActive"
                                                    onClick={() => handleClickOpenDeactivate(plan.price_id, plan.plan.plan_name)}
                                                /> */}
                                                <ActivateForm
                                                    loading={activeLoading}
                                                    showMessage={showMessageActiveDeactive}
                                                    setShowMessage={setShowMessageActiveDeactive}
                                                    message={messageActiveDeactive}
                                                    messageColor={messageColorActiveDeactive}
                                                    handleActivate={handleActivatePlan}
                                                    open={openDeactivate}
                                                    setOpen={setOpenDeactivate}
                                                    priceId={selectedPriceId}
                                                    planName={selectedPlanName}
                                                />
                                            </div>
                                        }
                                    </TableCell>
                                    {/* <TableCell>
                                        <Button
                                            className='text-greyplus hover:text-green hover:bg-white'
                                            onClick={() => handleClickOpenUpdatePlan(plan.id, plan.plan.plan_name, plan.plan.description)}
                                        >
                                            <EditIcon />
                                        </Button>
                                    </TableCell> */}
                                </TableRow>
                            )) : null}
                        </TableBody>
                    </Table>
                </TableContainer>
                <UpdatePlanForm
                    loading={updatePlanLoading}
                    showMessage={showMessageUpdate}
                    setShowMessage={setShowMessageUpdate}
                    message={messageUpdate}
                    messageColor={messageColorUpdate}
                    onSubmitPlan={onUpdatePlan}
                    formHandleSubmitPlan={updatePlanName}
                    register={updatePlanRegister}
                    errors={updatePlanErrors}
                    open={openUpdate}
                    setOpen={setOpenUpdate}
                    planName={selectedPlanName}
                    description={selectedDescription}
                />
            </div>
            {message !== "" ? (
                <Snackbar
                    showMessage={showMessage}
                    setShowMessage={setShowMessage}
                    message={message}
                    messageColor={messageColor}
                />
            ) : null}
            {loading ? (
                <Box className="text-greyplus mt-auto flex justify-center items-center">
                    <CircularProgress color="inherit" />
                </Box>
            ) : null}
        </Box>
    );
}
