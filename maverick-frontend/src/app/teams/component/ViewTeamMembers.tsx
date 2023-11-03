"use client";
import Box from "@mui/material/Box";
import * as React from "react";
import NavBar from "../../component/NavBar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import { useEffect } from 'react';
import { deleteTeam, deleteTeamMember, getTeamAndTeamMembers, inviteATeamMember, updateTeamMemberRole } from "../api/route";
import { Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, Divider, ListItemAvatar } from "@mui/material";
import ListItem from '@mui/material/ListItem';
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

const ViewTeamAndTeamMembers = (props: any) => {
    const id = props.id;
    const [loading, setLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);
    const [teamName, setTeamName] = React.useState("")
    const [teamMembers, setTeamMembers] = React.useState([])
    const [selectedTeamMemberIdForDelete, setSelectedTeamMemberIdForDelete] = React.useState(null);
    const [selectedTeamMemberIdForEdit, setSelectedTeamMemberIdForEdit] = React.useState(null);

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


    // Create or Update Team Name

    const submit = async (data: TeamsFormData) => {
        setShowMessage(true);
        setLoading(true);
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

    const handleDeleteTeam = async () => {
        setShowMessage(true);
        setLoading(true);
        const { props } = await deleteTeam(id)
        try {
            if (props && props.delete) {
                setMessage(Constants.TEAM_DELETED_SUCCESSFULLY);
                setMessageColor(Constants.SUCCESS);
                router.push('/teams');
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

    const handleClickOpenDelete = (teamId: string, teamMemberId: any) => {
        setSelectedTeamMemberIdForDelete(teamMemberId);
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

    const handleClickOpenUpdateMember = (teamId: string, teamMemberId: any) => {
        setSelectedTeamMemberIdForEdit(teamMemberId);
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
        setLoading(true);
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


    return (
        <Box className="flex flex-col">
            {/* <Fab
                size="small"
                className="mr-1 mt-1 bg-white text-edit border border-1 border-solid border-lightgrey hover:bg-lightgrey"
                onClick={handleClickOpenDeleteTeam}
            >
                <DeleteTeamIcon />
            </Fab>  */}
            <Paper className="w-full-tt shadow-none">
                <Dialog open={openDeleteTeam} onClose={handleCloseDeleteTeam}>
                    <DialogContent>
                        <DialogContentText className="text-black">
                            Are you sure you want to delete the Team {teamName} ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            className="text-white bg-edit hover:bg-lightblack"
                            onClick={handleDeleteTeam}
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={handleCloseDeleteTeam}
                            variant="outlined"
                            className="text-black border-black hover:bg-lightgrey"
                        >
                            No
                        </Button>
                    </DialogActions>
                </Dialog>
                <Table aria-label="simple table">
                    {/* <TableHead>
                    <TableRow>
                    <TableCell className="text-left font-bold text-lg"> </TableCell>
                    <TableCell className="text-right font-bold text-lg"> </TableCell>
                    <TableCell className="text-right font-bold text-lg"> </TableCell>
                    <TableCell className="text-right font-bold text-lg"> </TableCell>
                </TableRow>
                </TableHead> */}
                    <TableBody>
                        {teamMembers.map((teamMember) => (
                            <TableRow
                                key={teamMember['team_member_id']}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell className="font-Inter font-normal leading-6 text-smtext-black" component="th" scope="row">
                                    {teamMember['email']}
                                </TableCell>
                                <TableCell className="font-Inter font-normal leading-6 text-sm text-greyplus" align="right">
                                    {getTeamMemberRoles(teamMember['roles'])}
                                </TableCell>
                                <TableCell className="text-base" align="right">
                                    <Button
                                        size="small"
                                        className="-mr-4 font-Inter font-normal leading-6 text-sm text-black normal-case hover:text-green hover:bg-white "
                                        onClick={() => handleClickOpenUpdateMember(id, teamMember['team_member_id'])}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Typography className="-mr-4">|</Typography>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        className="-ml-10 -mr-4 font-Inter font-normal leading-6 text-sm text-black normal-case hover:text-red hover:bg-white"
                                        onClick={() => handleClickOpenDelete(id, teamMember['team_member_id'])}
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
                        <Box className='ml-20 mr-9 -mt-24'>
                            <DialogContentText className='ml-3 mr-3 mt-1 text-2xl text-black font-Inter font-bold'>
                                Are you sure you want to delete
                            </DialogContentText>
                            <DialogContentText className='ml-3 mr-3 text-2xl text-black font-Inter font-bold'>
                                the person
                            </DialogContentText>
                            <DialogContentText className='ml-3 mr-3 text-2xl text-black font-Inter font-bold'>
                                from {teamName} ?
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
                    loading={loading}
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
                />
            </Paper>
            <Box className='mt-5'>
                <Button
                    className="flex flex-col ml-auto mt-2 w-28 h-5 mb-4 mr-36 w-36 h-11 normal-case font-Inter leading-6 text-sm bg-white text-green font-bold border-green hover:bg-white hover:text-lightgreen"
                    size="small"
                    onClick={handleClickOpen}
                >
                    {"Update Team"}
                </Button>
                <CreateUpdateForm
                    loading={loading}
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
                />
                <Button
                    className="flex flex-end ml-auto -mt-12 mb-4 mr-2 w-36 h-11 normal-case font-Inter leading-6 text-sm bg-white text-green font-bold border-green hover:bg-grey hover:border-green"
                    variant="outlined"
                    onClick={handleClickOpenInvite}
                >
                    {"Invite Member"}
                </Button>
                <InviteTeamMember
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
                    <Box>
                        <CircularProgress />
                    </Box>
                ) : null
            }
        </Box >
    );
};
export default ViewTeamAndTeamMembers