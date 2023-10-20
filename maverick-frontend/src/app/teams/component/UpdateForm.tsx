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
import { InviteATeamMemberProps, UpdateATeamMemberProps } from '@/app/component/interfaces';
import Snackbar from '@/app/component/Snackbar';
import { useForm } from 'react-hook-form';

export default function UpdateATeamMember(
    {
        loading,
        showMessage,
        setShowMessage,
        message,
        messageColor,
        onSubmitRoles,
        formHandleSubmitRoles,
        register,
        errors,
        openUpdate,
        setOpenUpdate,
        // teamId,
        // teamMemberId,
    }: UpdateATeamMemberProps

) {

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    };

    const initialRolesState = [
        { name: "admin", checked: false },
        { name: "member", checked: false },
        { name: "owner", checked: false },
    ];
    const { handleSubmit } = useForm();
    const [roles, setRoles] = React.useState(initialRolesState);

    const handleChange = (name: any) => (event: any) => {
        const updatedRoles = roles.map((role) =>
            role.name === name ? { ...role, checked: event.target.checked } : role
        );
        setRoles(updatedRoles);
    };

    return (
        <div>
            <Dialog open={openUpdate} onClose={handleCloseUpdate}>
                <DialogTitle>Update User</DialogTitle>
                <DialogContent>
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
                        disabled={!roles}
                        className='text-white bg-primary hover:bg-lightblack'
                        variant='contained'
                        type='submit'
                        onClick={handleSubmit((data) => {
                            const formData = {
                                roles: roles.filter((role) => role.checked).map((role) => role.name),
                                admin: roles[0].checked,
                                member: roles[1].checked
                            };
                            formHandleSubmitRoles(onSubmitRoles(formData));
                        })}
                    >
                        Update Role
                    </Button>
                    <Button
                        className='text-black mr-2 border-black hover:bg-lightgrey'
                        variant='outlined'
                        onClick={handleCloseUpdate}
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