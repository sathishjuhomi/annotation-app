"use client";
import Box from "@mui/material/Box";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import { useEffect } from 'react';
import { deleteTeam, deleteTeamMember, getTeamAndTeamMembers, inviteATeamMember, updateTeamMemberRole, upgradePlan } from "../api/route";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import * as Constants from "../../utils/constant";
import Snackbar from "@/app/component/Snackbar";
import CreateUpdateForm from "./CreateUpdateForm";
import InviteTeamMember from "./InviteTeamMemberForm";
import { useForm } from "react-hook-form";
import { createOrUpdateTeamSchema, inviteTeamMemberSchema, updateTeamMemberSchema } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { TeamsFormData, UpdateATeamMemberFormData } from "@/app/component/interfaces";
import { InviteATeamMemberFormData } from "@/app/component/interfaces";
import { updateTeam } from "../api/route";
import teamMember from '@/app/component/teammember.jpg';
import Image from 'next/image'
import { useRouter } from "next/navigation";
import UpdateATeamMember from "./UpdateRolesForm";
import UpgradePlanForm from "./UpgradePlanForm";
import { activePlanList } from "../api/route";

const ViewTeamAndTeamMembers = (props: any) => {
    const id = props.id;
    const [loading, setLoading] = React.useState(false);
    const [dataLoading, setDataLoading] = React.useState(false);
    const [teamUpdateLoading, setTeamUpdateLoading] = React.useState(false);
    const [inviteLoading, setInviteLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);
    const [teamName, setTeamName] = React.useState("");
    const [teamId, setTeamId] = React.useState("");
    const [teamMembers, setTeamMembers] = React.useState([]);
    const [plans, setPlans] = React.useState([]);
    const [selectedTeamMemberIdForDelete, setSelectedTeamMemberIdForDelete] = React.useState('');
    const [selectedTeamMemberIdForEdit, setSelectedTeamMemberIdForEdit] = React.useState(null);
    const [selectedTeamMemberEmailId, setSelectedTeamMemberEmailId] = React.useState('');

    // Fetch the showTeams data using the getServerSideProps function
    useEffect(() => {
        async function fetchData() {
            const { props } = await getTeamAndTeamMembers(id);
            try {
                const teamNameValue = props.teamMembers.team["team_name"];
                const teamMembers = props.teamMembers.team_members;
                setTeamName(teamNameValue);
                setTeamMembers(teamMembers);
            } catch (error) {
                const data = props.teamMembers.detail;
                setMessage(data);
                setMessageColor(Constants.ERROR);
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);


    // Update Team Name

    const submit = async (data: TeamsFormData) => {
        setShowMessage(true);
        setDataLoading(true);
        const { props } = await updateTeam(id, data)
        try {
            if (((Object.keys(props.update).length) > 1)) {
                setMessage(Constants.TEAM_UPDATED_SUCCESSFULLY);
                setMessageColor(Constants.SUCCESS);
                location.reload();
            } else {
                const data = props.update.detail;
                setMessage(data);
                setMessageColor(Constants.ERROR);
            }
            setLoading(false);
        } catch (error) {
            const data = props.update.detail;
            setMessage(data);
            setMessageColor(Constants.ERROR);
            console.error('Error fetching data:', error);
        }
    };

    const getTeamMemberRoles = (role: any) => {
        const roleNames = []
        if (role['owner'] === true) {
            roleNames.push('Owner');
        }
        if (role['admin'] === true) {
            roleNames.push('Admin')
        }
        if (role['member'] === true) {
            roleNames.push("Member")
        }
        return roleNames.join(', ')
    }

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Delete Team

    const [openDeleteTeam, setOpenDeleteTeam] = React.useState(false);
    const handleClickOpenDeleteTeam = () => {
        setOpenDeleteTeam(true);
    };

    const handleCloseDeleteTeam = () => {
        setOpenDeleteTeam(false);
    };

    const router = useRouter();

    const handleDeleteTeam = async (teamId: string) => {
        setShowMessage(true);
        setLoading(true);
        const { props } = await deleteTeam(id)
        try {
            if (props && props.delete) {
                setMessage(Constants.TEAM_DELETED_SUCCESSFULLY);
                setMessageColor(Constants.SUCCESS);
                location.reload()
            } else {
                const data = props.delete.detail;
                setMessage(data);
                setMessageColor(Constants.ERROR);
            }
            setLoading(false);
        } catch (error) {
            const data = props.delete.detail;
            setMessage(data);
            setMessageColor(Constants.ERROR);
            console.error('Error fetching data:', error);
        }
    }

    // Invite A Team Member 

    const { register: createOrUpdateRegister,
        handleSubmit: createOrUpdateTeam,
        formState: { errors: createOrUpdateTeamErrors },
    } = useForm(
        { resolver: yupResolver(createOrUpdateTeamSchema) }
    )

    const { register: inviteTeamMemberRegister,
        handleSubmit: inviteTeamMember,
        formState: { errors: inviteTeamMemberErrors },
    } = useForm(
        { resolver: yupResolver(inviteTeamMemberSchema) }
    )

    const [openInvite, setOpenInvite] = React.useState(false);
    const handleClickOpenInvite = () => {
        setOpenInvite(true);
    };

    const onInviteTeamMember = async (data: InviteATeamMemberFormData) => {
        setShowMessage(true);
        setInviteLoading(true);
        const { props } = await inviteATeamMember(id, data)
        try {
            if (props && props.inviteMember) {
                setMessage(Constants.INVITED_SUCCESSFULLY);
                setMessageColor(Constants.SUCCESS);
                setOpenInvite(false);
                location.reload();
                setLoading(false);
            } else {
                const data = props.inviteMember.detail;
                setMessage(data);
                setMessageColor(Constants.ERROR);
            }
        }
        catch (error) {
            const data = props.inviteMember.detail;
            console.error('Error fetching data:', error);
            setMessage(data);
            setMessageColor(Constants.ERROR);
        }
    };

    // Delete Team Member

    const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = React.useState(false);

    const handleCloseDelete = () => {
        setOpenDeleteConfirmationDialog(false);
    };

    const handleClickOpenDelete = (teamId: string, teamMemberId: string, teamMemberEmailId: string) => {
        setSelectedTeamMemberIdForDelete(teamMemberId);
        setSelectedTeamMemberEmailId(teamMemberEmailId)
        setOpenDeleteConfirmationDialog(true);
    };

    const handleDeleteTeamMember = async (teamId: string, teamMemberId: any) => {
        setShowMessage(true);
        const { props } = await deleteTeamMember(teamId, teamMemberId);
        try {
            setMessage(Constants.TEAM__MEMBER_DELETED_SUCCESSFULLY);
            setMessageColor(Constants.SUCCESS);
            location.reload();
        } catch (error) {
            const data = props.deleteMember.detail;
            setMessage(data);
            setMessageColor(Constants.ERROR);
            console.error('Error fetching data:', error);
        }
    }

    // Update Team Member role

    const [openUpdateMember, setOpenUpdateMember] = React.useState(false);

    const handleClickOpenUpdateMember = (teamId: string, teamMemberId: any, teamMemberEmailId: string) => {
        setSelectedTeamMemberIdForEdit(teamMemberId);
        setSelectedTeamMemberEmailId(teamMemberEmailId);
        setOpenUpdateMember(true);
    };

    const { register: updateTeamMemberRegister,
        handleSubmit: updateTeamMember,
        formState: { errors: updateTeamMemberErrors },
    } = useForm(
        { resolver: yupResolver(updateTeamMemberSchema) }
    )

    const onUpdateTeamMember = async (teamId: string, teamMemberId: string, data: UpdateATeamMemberFormData) => {
        setShowMessage(true);
        setTeamUpdateLoading(true);
        const { props } = await updateTeamMemberRole(teamId, teamMemberId, data);
        try {
            const data = props.updateMember.detail;
            setMessage(data);
            setMessageColor(Constants.SUCCESS);
            location.reload();
        } catch (error) {
            const data = props.updateMember.detail;
            setMessage(data);
            setMessageColor(Constants.ERROR);
            console.error('Error fetching data:', error);
        }
    }

    // Upgrade Plan
    const [openUpgrade, setOpenUpgrade] = React.useState(false);
    const handleOpenUpgrade = () => {
        setOpenUpgrade(true);
    };

    // View Plans
    useEffect(() => {
        async function fetchData() {
            const { props } = await activePlanList(false);
            try {
                setPlans(props.plans);
            } catch (error) {
                const data = props.plans.detail;
                setMessage(data);
                setMessageColor(Constants.ERROR);
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <Box className="flex flex-col">
            <Paper className="ml-6 w-full-tt shadow-none">
                <Box className=" rounded-md flex w-full-tt h-16 mt-2 bg-beige">
                    <Typography className="pt-5 ml-8 font-Inter font-normal leading-6 text-sm text-black">
                        You are in FREE Plan, for more feature
                    </Typography>
                    <Button
                        className="mt-4 h-8 ml-auto mr-6 normal-case font-Inter font-bold leading-6 text-sm text-black hover:bg-beige"
                        onClick={handleOpenUpgrade}
                    >
                        Upgrade Now
                    </Button>
                    <UpgradePlanForm
                        open={openUpgrade}
                        setOpen={setOpenUpgrade}
                        plans={plans}
                        teamId={id}
                    />
                </Box>
                <Table aria-label="simple table">
                    <TableBody>
                        {teamMembers.map((teamMember) => (
                            <TableRow
                                className="h-16"
                                key={teamMember['team_member_id']}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell className="pl-8 font-Inter font-normal leading-6 text-sm text-black" component="th" scope="row">
                                    {teamMember['email']}
                                </TableCell>
                                <TableCell className="font-Inter font-normal leading-6 text-sm text-greyplus" align="right">
                                    {getTeamMemberRoles(teamMember['roles'])}
                                </TableCell>
                                <TableCell className="flex">
                                    <Button
                                        size="small"
                                        className="ml-auto font-Inter font-normal leading-6 text-sm text-black normal-case hover:text-green hover:bg-white "
                                        onClick={() => handleClickOpenUpdateMember(id, teamMember['team_member_id'], teamMember['email'])}
                                    >
                                        Edit
                                    </Button>
                                    <Typography className="pt-1">|</Typography>
                                    <Button
                                        size="small"
                                        className="ml-2 mr-1 font-Inter font-normal leading-6 text-sm text-black normal-case hover:text-red hover:bg-white"
                                        onClick={() => handleClickOpenDelete(id, teamMember['team_member_id'], teamMember['email'])}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Dialog className='rounded-md' open={openDeleteConfirmationDialog} onClose={handleCloseDelete}>
                    <DialogContent className="ml-10 mr-22">
                        <div className="flex flex-row -mt-2">
                            <Image
                                src={teamMember}
                                alt='TeamMember'
                                className="w-16 h-22 mt-11"
                                quality={100}
                                placeholder='blur'
                            />
                        </div>
                        <Box className='ml-20 -mt-24'>
                            <DialogContentText className='ml-3 mr-10 mt-1 text-2xl text-black font-Inter font-bold leading-8'>
                                Are you sure you want to delete
                            </DialogContentText>
                            <DialogContentText className='ml-3 mr-10 text-2xl text-black font-Inter leading-8'>
                                <b>the person</b> <p className="text-xl">({selectedTeamMemberEmailId})</p>
                            </DialogContentText>
                            <DialogContentText className='ml-3 mr-3 text-2xl text-black font-Inter font-bold leading-8'>
                                from <span className="uppercase"> {teamName}</span> Team
                            </DialogContentText>
                            <DialogContentText className='ml-4 mr-42 mt-2 text-greyplus text-sm font-Inter font-normal leading-6'>
                                It will impact all the relevant data from the user
                            </DialogContentText>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseDelete}
                            variant="outlined"
                            className="w-20 h-11 mr-1 mb-10 text-white font-Inter font-bold leading-6 normal-case bg-git hover:bg-lightblack hover:border-black"
                        >
                            No
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            className="w-20 h-11 mr-10 mb-10 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen"
                            onClick={() => handleDeleteTeamMember(id, selectedTeamMemberIdForDelete)}
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
                <UpdateATeamMember
                    loading={teamUpdateLoading}
                    showMessage={showMessage}
                    setShowMessage={setShowMessage}
                    message={message}
                    messageColor={messageColor}
                    onSubmitRoles={onUpdateTeamMember}
                    formHandleSubmitRoles={updateTeamMember}
                    register={updateTeamMemberRegister}
                    errors={updateTeamMemberErrors}
                    open={openUpdateMember}
                    setOpen={setOpenUpdateMember}
                    teamId={id}
                    teamMemberId={selectedTeamMemberIdForEdit}
                    teamMemberEmailId={selectedTeamMemberEmailId}
                />
            </Paper>
            <Box className='mt-5'>
                <Button
                    className="flex flex-col ml-auto mt-2 w-28 h-5 mb-4 w-36 h-11 mr-44 normal-case font-Inter leading-6 text-sm bg-white text-green font-bold border-green hover:bg-white hover:text-lightgreen"
                    size="small"
                    onClick={handleClickOpen}
                >
                    {"Update Team"}
                </Button>
                <CreateUpdateForm
                    loading={dataLoading}
                    showMessage={showMessage}
                    setShowMessage={setShowMessage}
                    message={message}
                    messageColor={messageColor}
                    onSubmit={submit}
                    formHandleSubmit={createOrUpdateTeam}
                    register={createOrUpdateRegister}
                    errors={createOrUpdateTeamErrors}
                    open={open}
                    setOpen={setOpen}
                    teamTitle={teamName}
                    teamId={id}
                />
                <Button
                    className="flex flex-end ml-auto -mt-12 mb-4 mr-6 w-36 h-11 normal-case font-Inter leading-6 text-sm bg-white text-green font-bold border-green hover:bg-grey hover:border-green"
                    variant="outlined"
                    onClick={handleClickOpenInvite}
                >
                    {"Invite Member"}
                </Button>
                <InviteTeamMember
                    loading={inviteLoading}
                    showMessage={showMessage}
                    setShowMessage={setShowMessage}
                    message={message}
                    messageColor={messageColor}
                    onSubmit={onInviteTeamMember}
                    formHandleSubmitInvite={inviteTeamMember}
                    register={inviteTeamMemberRegister}
                    errors={inviteTeamMemberErrors}
                    open={openInvite}
                    setOpen={setOpenInvite}
                />
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
                        className="text-greyplus flex justify-center items-center"
                    >
                        <CircularProgress color="inherit" />
                    </Box>
                ) : null
            }
        </Box >
    );
};
export default ViewTeamAndTeamMembers;
