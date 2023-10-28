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
import { Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, ListItemAvatar } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import * as Constants from "../../utils/constant";
import Snackbar from "@/app/component/Snackbar";
import CreateUpdateForm from "../component/CreateUpdateForm";
import InviteTeamMember from "../component/InviteTeamMemberForm";
import { useForm } from "react-hook-form";
import { createOrUpdateTeamSchema, inviteTeamMemberSchema, updateTeamMemberSchema } from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { TeamsFormData, UpdateATeamMemberFormData } from "@/app/component/interfaces";
import { InviteATeamMemberFormData } from "@/app/component/interfaces";
import { updateTeam } from "../api/route";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteTeamIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import { useRouter } from "next/navigation";
import UpdateATeamMember from "../component/UpdateRolesForm";

const ViewTeamAndTeamMembers = ({ params }: { params: { id: string } }) => {
    const id = params.id;
    const [loading, setLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);
    const [teamName, setTeamName] = React.useState("")
    const [teamMembers, setTeamMembers] = React.useState([])
    const [selectedTeamMemberIdForDelete, setSelectedTeamMemberIdForDelete] = React.useState(null);
    const [selectedTeamMemberIdForEdit, setSelectedTeamMemberIdForEdit] = React.useState(null);

    useEffect(() => {
        getTeamAndTeamMembers(id)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    const teamNameValue = response.team["team_name"];
                    const teamMembers = response.team_members;
                    setTeamName(teamNameValue);
                    setTeamMembers(teamMembers);
                    router.push(`/teams/${id}`);
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
    }, []);

  // Fetch the showTeams data using the getServerSideProps function
//   useEffect(() => {
//     async function fetchData() {
//       const { props } = await getTeamAndTeamMembers(id);
//       setTeams(props.teams);
//       if (props.teams.status === 200) {
//         const teamName = localStorage.getItem('teamName');
//         if (teamName === null) {
//           localStorage.setItem('teamName', props.teams[0]['team_name'])
//         }
//         setTeams(props.teams);
//       }
//     }
//       fetchData();
//     }, []);

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
    const handleClose = () => {
        setOpen(false);
    };

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
        await deleteTeam(id)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    setMessage(Constants.TEAM_DELETED_SUCCESSFULLY);
                    setMessageColor(Constants.SUCCESS);
                    router.push('/teams');
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
    }

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
        await deleteTeamMember(teamId, teamMemberId)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    setMessage(Constants.TEAM__MEMBER_DELETED_SUCCESSFULLY);
                    setMessageColor(Constants.SUCCESS);
                    location.reload();
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
    }

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
        await updateTeamMemberRole(teamId, teamMemberId, data)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    setMessage(Constants.TEAM__MEMBER_UPDATED_SUCCESSFULLY);
                    setMessageColor(Constants.SUCCESS);
                    location.reload();
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
    }

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

    const submit = async (data: TeamsFormData) => {
        setShowMessage(true);
        setLoading(true);
        await updateTeam(id, data)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    setMessage(Constants.TEAM_UPDATED_SUCCESSFULLY);
                    setMessageColor(Constants.SUCCESS);
                    location.reload();
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

    const [openInvite, setOpenInvite] = React.useState(false);
    const handleClickOpenInvite = () => {
        setOpenInvite(true);
    };

    const onInviteTeamMember = async (data: InviteATeamMemberFormData) => {
        setShowMessage(true);
        await inviteATeamMember(id, data)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    setMessage(Constants.INVITED_SUCCESSFULLY);
                    setMessageColor(Constants.SUCCESS);
                    setOpenInvite(false);
                    location.reload();
                } else {
                    const data = response.detail;
                    setMessage(data);
                    setMessageColor(Constants.ERROR);
                }
            })
            .catch((error) => {
                setMessage(error);
                setMessageColor(Constants.ERROR);
            });
    };

    return (
        <Box className="flex">
            <NavBar></NavBar>
            <Box component="main" className="mt-10"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
                <Paper className="mt-4 ml-4 mr-4">
                    <br></br>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar className="bg-black">{teamName[0]}</Avatar>
                        </ListItemAvatar>
                        <Typography className="mt-5 text-black text-xl font-bold">
                            {teamName}
                        </Typography>
                        <Fab
                            className="ml-auto mt-1 mb-1 mr-4 text-white bg-edit border border-1 border-solid border-lightgrey hover:bg-lightblack"
                            size="small"
                            onClick={handleClickOpen}
                        >
                            <EditIcon />
                        </Fab>
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
                        <Fab
                            size="small"
                            className="mr-1 mt-1 bg-white text-edit border border-1 border-solid border-lightgrey hover:bg-lightgrey"
                            onClick={handleClickOpenDeleteTeam}
                        >
                            <DeleteTeamIcon />
                        </Fab>
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
                    </ListItem>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell className="text-left font-bold text-lg">Member</TableCell>
                                <TableCell className="text-right font-bold text-lg">Role</TableCell>
                                <TableCell className="text-right font-bold text-lg"> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teamMembers.map((teamMember) => (
                                <TableRow
                                    key={teamMember['team_member_id']}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell className="text-base" component="th" scope="row">
                                        {teamMember['email']}
                                    </TableCell>
                                    <TableCell className="text-base" align="right">
                                        {getTeamMemberRoles(teamMember['roles'])}
                                    </TableCell>
                                    <TableCell className="text-base" align="right">
                                        <Fab
                                            size="small"
                                            className="mr-1 mt-1 mr-4 bg-edit text-white border border-1 border-solid border-lightgrey hover-bg-lightblack"
                                            onClick={() => handleClickOpenUpdateMember(id, teamMember['team_member_id'])}
                                        >
                                            <EditIcon />

                                        </Fab>
                                        <Fab
                                            size="small"
                                            className="mr-1 mt-1 bg-white text-edit border border-1 border-solid border-lightgrey hover-bg-lightgrey"
                                            onClick={() => handleClickOpenDelete(id, teamMember['team_member_id'])}
                                        >
                                            <DeleteIcon />
                                        </Fab>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                    <Dialog open={openDeleteConfirmationDialog} onClose={handleCloseDelete}>
                        <DialogContent>
                            <DialogContentText className="text-black">
                                Are you sure you want to delete the person from {teamName} ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                type="submit"
                                variant="contained"
                                className="text-white bg-edit hover-bg-lightblack"
                                onClick={() => handleDeleteTeamMember(id, selectedTeamMemberIdForDelete)}
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={handleCloseDelete}
                                variant="outlined"
                                className="text-black border border-1 border-solid border-black hover-bg-lightgrey"
                            >
                                No
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
                    <br></br>
                    <Button
                        className="ml-3 mt-1 mb-4 text-white font-bold bg-green hover:bg-lightgreen"
                        variant="contained"
                        onClick={handleClickOpenInvite}
                    >
                        Invite A Member
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
                </Paper>
                {message !== "" ? (
                    <Snackbar
                        showMessage={showMessage}
                        setShowMessage={setShowMessage}
                        message={message}
                        messageColor={messageColor}
                    />
                ) : null}
                {loading ? (
                    <Box>
                        <CircularProgress />
                    </Box>
                ) : null}
            </Box>
        </Box >
    );
};
export default ViewTeamAndTeamMembers