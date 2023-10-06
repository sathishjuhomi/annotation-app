import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { CircularProgress, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { InviteATeamMemberProps } from '@/app/component/interfaces';
import Snackbar from '@/app/component/Snackbar';

export default function InviteTeamMember(
    {
        loading,
        showMessage,
        setShowMessage,
        message,
        messageColor,
        onSubmit,
        formHandleSubmitInvite,
        register,
        errors,
        open,
        setOpen,
    }: InviteATeamMemberProps

) {
    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseInvite = () => {
        setOpen(false);
    };

    // Things which tried
    // const initialRolesState = [
    //     { name: "admin", checked: false },
    //     { name: "member", checked: false },
    // ];

    // const [roles, setRoles] = React.useState(initialRolesState);


    const [role, setRole] = React.useState({
        admin: false,
        member: false,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole({
            ...role,
            [event.target.name]: event.target.checked,
        });
    };

    // Things to do
    // const handleChange = (name) => (event) => {
    //     const updatedRoles = roles.map((role) =>
    //         role.name === name ? { ...role, checked: event.target.checked } : role
    //     );
    //     setRoles(updatedRoles);
    // };

    const { admin, member } = role;
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Invite User</DialogTitle>
                <DialogContent>
                    <DialogContentText className='text-black'>
                        Invite a member to join your team.
                    </DialogContentText>
                    <br></br>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        variant='outlined'
                        placeholder="Enter invite member's mail Id"
                        {...register("email")}
                        error={Boolean(errors?.email)}
                        helperText={errors?.email ? errors?.email.message : " "}
                    />
                    <br></br><br></br>
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel className="text-black font-bold">Assign roles</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={admin} onChange={handleChange} name="admin" />
                                }
                                label="Admin"
                                {...register("admin")}
                                error={Boolean(errors?.admin)}
                                helperText={admin? errors?.admin.message : " "}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={member} onChange={handleChange} name="member" />
                                }
                                label="Member"
                                {...register("member")}
                                error={Boolean(errors?.member)}
                                helperText={member? errors?.member.message : " "}
                            />
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        className='text-white bg-primary'
                        variant='contained'
                        type='submit'
                        // onClick={() => {
                        // const formData = {
                        //     email: register.email.value,
                        //     admin,
                        //     member,
                        // };
                        // onSubmit(formData);
                        // }}
                        onClick={formHandleSubmitInvite(onSubmit)}
                    >
                        Send Invitation
                    </Button>
                    <Button
                        className='text-black mr-2'
                        variant='outlined'
                        onClick={handleCloseInvite}
                    >
                        Cancel
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
    )
};