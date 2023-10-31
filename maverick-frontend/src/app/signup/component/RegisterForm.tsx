import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import { SignUpProps } from "../../component/interfaces";
import Snackbar from "../../component/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import imageTwo from '../../component/image2.jpg';
import Image from 'next/image'

const defaultTheme = createTheme();

export default function SignUp({
  loading,
  showMessage,
  setShowMessage,
  message,
  messageColor,
  onSubmit,
  formHandleSubmit,
  register,
  errors,
}: SignUpProps) {
  return (
    <Box className='flex flex-row -mb-96'>
      <Box className=" max-w-3xl max-h-56 mt-10 ml-14 flex flex-col  bg-white">
        <Typography className="text-black font-Inter font-bold text-left text-2xl ml-6 mt-6 leading-10 -tracking-1" component="h1" variant="h5">
          Sign up
        </Typography>
        <br />
        <form onSubmit={formHandleSubmit(onSubmit)} noValidate>
          <Box className="mt-1 mr-2 flex flex-row">
            <Grid className="mb-1 ml-4 border-inherit border-1 rounded-none">
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                {...register("email")}
                error={Boolean(errors?.email)}
                helperText={errors?.email ? errors?.email.message : " "}
              />
            </Grid>
            <Grid className="mb-1 ml-4 border-inherit border-1 rounded-none">
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
                error={Boolean(errors?.password)}
                helperText={errors?.password ? errors?.password.message : " "}
              />
            </Grid>
            <Grid className="mb-1 ml-4 border-inherit border-1 rounded-none">
              <TextField
                required
                fullWidth
                name="passwordConfirm"
                label="Confirm Password"
                type="password"
                id="passwordConfirm"
                autoComplete="new-password"
                {...register("passwordConfirm")}
                error={Boolean(errors?.passwordConfirm)}
                helperText={
                  errors?.passwordConfirm
                    ? errors?.passwordConfirm.message
                    : " "
                }
              />
            </Grid>
            <Button
              type="submit"
              style={{ width: '100px', height: '55px' }}
              variant="contained"
              className="text-white bg-button ml-2 mr-2 normal-case hover:bg-lightgreen"
            >
              Sign Up
            </Button>
          </Box>
          <Grid container justifyContent="flex-end" className="ml-4 mb-4 flex flex-col">
            <Grid item>
              <Link href="/signin" variant="body2" className="text-button">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>

        </form>
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
      {/* <div className="ml-42 mt-10 -mb-6">
          <Image
            src={imageTwo}
            alt='ImageTwo'
            className="ml-32 w-72 max-h-96 rounded-2xl"
            quality={100}
            placeholder='blur'
          />
        </div> */}
    </Box>
  );
}
