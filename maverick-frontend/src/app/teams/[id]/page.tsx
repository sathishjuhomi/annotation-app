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
import { getTeamAndTeamMembers } from "../api/route";
import { Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, ListItemAvatar } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import * as Constants from "../../utils/constant";
import Snackbar from "@/app/component/Snackbar";
import CreateUpdateForm from "../component/CreateUpdateForm";
import { useForm } from "react-hook-form";
import teamSchema from "../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { TeamsFormData } from "@/app/component/interfaces";
import { updateTeam } from "../api/route";
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';

const ViewTeamAndTeamMembers = ({ params }: { params: { id: string } }) => {
    const [loading, setLoading] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [messageColor, setMessageColor] = React.useState(Constants.INFO);
    const [teamName, setTeamName] = React.useState("")
    const [teamMembers, setTeamMembers] = React.useState([])
    useEffect(() => {
        getTeamAndTeamMembers(params.id)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    const teamNameValue = response.team["team_name"];
                    const teamMembers = response.team_members;
                    setTeamName(teamNameValue);
                    setTeamMembers(teamMembers);
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
    const handleClose = () => {
        setOpen(false);
    };
    const [openDelete, setOpenDelete] = React.useState(false);
    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const { register,
        handleSubmit,
        formState: { errors },
    } = useForm(
        { resolver: yupResolver(teamSchema) }
    )
    const submit = async (data: TeamsFormData) => {
        setShowMessage(true);
        setLoading(true);
        await updateTeam(params.id, data)
            .then(async (res) => {
                const response = await res.json();
                if (res.status === 200) {
                    console.log("Update Team res", response);
                    setMessage(Constants.TEAM_UPDATED_SUCCESSFULLY);
                    setMessageColor(Constants.SUCCESS);
                    location.reload()
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
                            <Avatar className="bg-tertiary">{teamName[0]}</Avatar>
                        </ListItemAvatar>
                        <Typography className="mt-5 text-black text-xl font-bold">
                            {teamName}
                        </Typography>
                        <Fab
                            color="secondary"
                            size="small"
                            className="ml-auto mr-2 mt-1 bg-primary"
                            onClick={handleClickOpenDelete}
                        >
                            <DeleteIcon />
                        </Fab>
                        <Dialog open={openDelete} onClose={handleCloseDelete}>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure You want to delete the Team {teamName} ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="bg-primary"
                                // onClick={}
                                >
                                    Yes
                                </Button>
                                <Button
                                    onClick={handleCloseDelete}
                                    variant="contained"
                                    className="bg-primary"
                                >
                                    No
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Button
                            className="mt-1 mb-1 text-white bg-primary"
                            variant="contained"
                            onClick={handleClickOpen}
                        >
                            Edit Team
                        </Button>
                        <CreateUpdateForm
                            loading={loading}
                            showMessage={showMessage}
                            setShowMessage={setShowMessage}
                            message={message}
                            messageColor={messageColor}
                            onSubmit={submit}
                            formHandleSubmit={handleSubmit}
                            register={register}
                            errors={errors}
                            open={open}
                            setOpen={setOpen}
                            teamTitle={teamName}
                        />
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
                                        <Button
                                            className="ml-auto mt-1 mb-1 text-black"
                                            variant="outlined"
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <br></br>
                    <Button
                        className="ml-3 mt-1 mb-4 text-white font-bold bg-tertiary"
                        variant="contained"
                    >
                        Invite A Member
                    </Button>
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