"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { CircularProgress, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import { UpdateATeamMemberProps } from '@/app/component/interfaces';
import Snackbar from '@/app/component/Snackbar';
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";

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
        open,
        setOpen,
        teamId,
        teamMemberId,
    }: UpdateATeamMemberProps

) {

    const handleCloseUpdate = () => {
        setOpen(false);
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

    const router = useRouter();
    const navigateToTeams = () => {
        location.reload();
    };
    return (
        <div>
            <Dialog open={open} onClose={handleCloseUpdate}>
                <DialogTitle>Update User</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel className="text-black font-bold">Assign roles</FormLabel>
                        <FormGroup>
                            {roles.map((role) => (
                                <FormControl
                                    key={role.name}
                                    error={Boolean(errors?.[role.name])}
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
                                        {...register(role.name)}
                                    />
                                    <FormHelperText>
                                        {errors[role.name] ? errors[role.name].message : ' '}
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
                        className='text-white bg-edit hover:bg-lightblack'
                        variant='contained'
                        type='submit'
                        onClick={handleSubmit(() => {
                            const formData = {
                                roles: roles.filter((role) => role.checked).map((role) => role.name),
                                owner: roles[0].checked,
                                admin: roles[1].checked,
                                member: roles[2].checked,
                            };
                            formHandleSubmitRoles(onSubmitRoles(teamId, teamMemberId, formData));
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
    );
}
