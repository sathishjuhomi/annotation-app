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
import { CircularProgress, DialogContent, DialogContentText, DialogTitle, FormHelperText } from '@mui/material';
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
        { name: "admin", checked: false },
        { name: "owner", checked: false },
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
            <Dialog className='rounded-md' open={open} onClose={handleCloseUpdate}>
                <DialogTitle className='ml-3 mr-52 mt-8 text-2xl text-black font-Inter font-bold'>Update User Roles</DialogTitle>
                <DialogContent>
                    <DialogContentText className='ml-4 mr-60 -mt-1 text-greyplus text-sm font-Inter font-normal leading-6'>
                        It will impact selected user roles
                    </DialogContentText>
                    <br></br>
                    <FormControl className='ml-4 mr-4 -mt-6 capitalize text-black font-Inter font-normal leading-6'>
                        <FormGroup className='flex flex-row mt-8'>
                            {roles.map((role) => (
                                <FormControl
                                    className='mr-10'
                                    key={role.name}
                                    error={Boolean(errors?.[role.name])}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                className='ml-2 w-6 h-6 text-greyplus hover:bg-grey2'
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
                        className='mr-2 w-28 h-11 text-white font-Inter font-bold leading-6 normal-case bg-git hover:bg-lightblack'
                        variant='outlined'
                        onClick={navigateToTeams}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!roles}
                        className='w-38 h-11 ml-6 mr-10 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen'
                        variant='contained'
                        type='submit'
                        onClick={handleSubmit(() => {
                            const formData = {
                                roles: roles.filter((role) => role.checked).map((role) => role.name),
                                admin: roles[0].checked,
                                owner: roles[1].checked,
                                member: roles[2].checked,
                            };
                            formHandleSubmitRoles(onSubmitRoles(teamId, teamMemberId, formData));
                        })}
                    >
                        Update Role
                    </Button>
                </DialogActions>
                <br></br> <br></br>
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
