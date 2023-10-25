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
import { Avatar, CircularProgress, DialogContent, DialogContentText, DialogTitle, ListItemAvatar } from "@mui/material";
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
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import UpdateATeamMember from "../component/UpdateRolesForm";

const ViewTeamAndTeamMembers = ({ params }: { params: { id: string } }) => {
    const [loading, setLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);
    const [teamName, setTeamName] = React.useState("")
    const [teamMembers, setTeamMembers] = React.useState([])

    console.log("PAGE TEAM MEMBERS: ", teamMembers)
    useEffect(() => {
        getTeamAndTeamMembers(params.id)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    const teamNameValue = response.team["team_name"];
                    const teamMembers = response.team_members;
                    setTeamName(teamNameValue);
                    setTeamMembers(teamMembers);
                    router.push(`/teams/${params.id}`);
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

    const [openDelete, setOpenDelete] = React.useState(false);
    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
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
        await deleteTeam(params.id)
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

    const handleDeleteTeamMember = async (teamId: string, teamMemberId: string) => {
        setShowMessage(true);
        setLoading(true);
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
    const handleClickOpenUpdateMember = () => {
        setOpenUpdateMember(true)
    }
    const handleClickCloseUpdate = () => {
        setOpenUpdateMember(false);
    };

    const initialRolesState = [
        { name: "owner", checked: false },
        { name: "admin", checked: false },
        { name: "member", checked: false },
    ];
    const { handleSubmit } = useForm();
    const [roles, setRoles] = React.useState(initialRolesState);

    const handleChange = (name: any) => (event: any) => {
        const updatedRoles = roles.map((role) =>
            role.name === name ? { ...role, checked: event.target.checked } : role
        );
        setRoles(updatedRoles);
    };

    const navigateToTeams = () => {
        location.reload();
    };

    const { register: updateTeamMemberRegister,
        handleSubmit: updateTeamMember,
        formState: { errors: updateTeamMemberErrors },
    } = useForm(
        { resolver: yupResolver(updateTeamMemberSchema) }
    )

    const onSubmitRoles = async (teamId: string, teamMemberId: string, data: UpdateATeamMemberFormData) => {
        setShowMessage(true);
        setLoading(true);
        console.log("Team_ID: ", teamId)
        console.log("TeamMemberID: ", teamMemberId)
        console.log("DAta: ", data)
        await updateTeamMemberRole(teamId, teamMemberId, data)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    setMessage(Constants.TEAM__MEMBER_UPDATED_SUCCESSFULLY);
                    setMessageColor(Constants.SUCCESS);
                    // location.reload();
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
        await updateTeam(params.id, data)
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
        setLoading(true);
        await inviteATeamMember(params.id, data)
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
                setLoading(false);
            })
            .catch((error) => {
                setMessage(error);
                setLoading(false);
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
                            <Avatar className="bg-grey">{teamName[0]}</Avatar>
                        </ListItemAvatar>
                        <Typography className="mt-5 text-black text-xl font-bold">
                            {teamName}
                        </Typography>
                        <Fab
                            className="ml-auto mt-1 mb-1 mr-4 text-white bg-primary border border-2 border-solid border-black hover:bg-lightblack"
                            color="primary"
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
                            className="mr-1 mt-1 bg-white text-lightblack border border-1 border-solid border-black hover:bg-lightgrey"
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
                                    className="text-white bg-primary hover:bg-lightblack"
                                    onClick={handleDeleteTeam}
                                >
                                    Yes
                                </Button>
                                <Button
                                    onClick={handleCloseDeleteTeam}
                                    variant="outlined"
                                    className="text-black border border-1 border-solid border-black hover:bg-lightgrey"
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
                                            className="mr-1 mt-1 mr-4 bg-primary text-white border border-2 border-solid border-black hover:bg-lightblack"
                                            color="primary"
                                            onClick={handleClickOpenUpdateMember}
                                        >
                                            <EditIcon />
                                            <div>
                                                <Dialog open={openUpdateMember} onClose={handleClickCloseUpdate}>
                                                    <DialogTitle>Update User</DialogTitle>
                                                    <DialogContent>
                                                        <FormControl component="fieldset" variant="standard">
                                                            <FormLabel className="text-black font-bold">Assign roles</FormLabel>
                                                            <FormGroup>
                                                                {roles.map((role) => (
                                                                    <FormControl
                                                                        key={role.name}
                                                                        //error={Boolean(updateTeamMemberErrors?.[role.name])} // Move error handling to FormControl
                                                                    >
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={role.checked}
                                                                                    onChange={handleChange(role.name)}
                                                                                    name={role.name}
                                                                                />
                                                                            }
                                                                            label={role.name}
                                                                            // {...updateTeamMemberRegister(role.name)}
                                                                        />
                                                                        <FormHelperText>
                                                                            {/* {errors[role.name] ? errors[role.name].message : ' '} */}
                                                                        </FormHelperText>
                                                                    </FormControl>
                                                                ))}
                                                            </FormGroup>
                                                        </FormControl>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button
                                                            className='text-black mr-2 border-black hover:bg-lightgrey'
                                                            variant='outlined'
                                                            onClick={navigateToTeams}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            disabled={!roles}
                                                            className='text-white bg-primary hover:bg-lightblack'
                                                            variant='contained'
                                                            type='submit'
                                                            onClick={handleSubmit((data) => {
                                                                const formData = {
                                                                    roles: roles.filter((role) => role.checked).map((role) => role.name),
                                                                    owner: roles[0].checked,
                                                                    admin: roles[1].checked,
                                                                    member: roles[2].checked,
                                                                };
                                                                (onSubmitRoles(params.id, teamMember['team_member_id'], formData));
                                                                console.log("DIALOGUE TEAM MEMBER Id: ", teamMember['team_member_id'])                                    
                                                            })}
                                                        >
                                                            Update Role
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
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
                                            </div>
                                        </Fab>
                                        <Fab
                                            size="small"
                                            className="mr-1 mt-1 bg-white text-lightblack border border-1 border-solid border-black hover:bg-lightgrey"
                                            onClick={handleClickOpenDelete}
                                        >
                                            <DeleteIcon />
                                        </Fab>
                                        <Dialog open={openDelete} onClose={handleCloseDelete}>
                                            <DialogContent>
                                                <DialogContentText className="text-black">
                                                    Are you sure you want to delete the person from {teamName} ?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    className="text-white bg-primary hover:bg-lightblack"
                                                    onClick={() => handleDeleteTeamMember(params.id, teamMember['team_member_id'])}
                                                >
                                                    Yes
                                                </Button>
                                                <Button
                                                    onClick={handleCloseDelete}
                                                    variant="outlined"
                                                    className="text-black border border-1 border-solid border-black"
                                                >
                                                    No
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <br></br>
                    <Button
                        className="ml-3 mt-1 mb-4 text-white font-bold bg-black hover:bg-lightblack"
                        variant="contained"
                        onClick={handleClickOpenInvite}
                    >
                        Invite A Member
                    </Button>
                    <InviteTeamMember
                        loading={loading}
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
        </Box>
    );
};
export default ViewTeamAndTeamMembers