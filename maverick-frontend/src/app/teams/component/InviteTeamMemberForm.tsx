"use client"
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
import { useForm } from 'react-hook-form';

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

    const initialRolesState = [
        { name: "admin", checked: false },
        { name: "member", checked: false },
    ];
    const { handleSubmit } = useForm();
    
    const [email, setMail] = React.useState("");
    const [roles, setRoles] = React.useState(initialRolesState);

    const handleChange = (name: any) => (event: any) => {
        const updatedRoles = roles.map((role) =>
            role.name === name ? { ...role, checked: event.target.checked } : role
        );
        setRoles(updatedRoles);
    };

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
                        autoComplete="email"
                        variant='outlined'
                        placeholder="Enter invite member's mail Id"
                        onChange={(e) => setMail(e.target.value)}
                        error={Boolean(errors?.email)}
                        helperText={errors?.email ? errors?.email.message : " "}
                    />
                    <br></br><br></br>
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel className="text-black font-bold">Assign roles</FormLabel>
                        <FormGroup>
                            {roles.map((role) => (
                                <FormControlLabel
                                    key={role.name}
                                    control={
                                        <Checkbox
                                            checked={role.checked}
                                            onChange={handleChange(role.name)}
                                            name={role.name} />
                                    }
                                    label={role.name}
                                    {...register(role.name)}
                                    error={Boolean(errors?.[role.name])}
                                    helperText={errors[role.name] ? errors[role.name].message : " "}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        className='text-white bg-primary'
                        variant='contained'
                        type='submit'
                        disabled={!email}
                        onClick={handleSubmit((data) => {
                              const formData = {
                                email: email,
                                roles: roles.filter((role) => role.checked).map((role) => role.name),
                                admin: roles[0].checked,
                                member: roles[1].checked
                              };
                              formHandleSubmitInvite(onSubmit(formData));
                          })}
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
    );
}