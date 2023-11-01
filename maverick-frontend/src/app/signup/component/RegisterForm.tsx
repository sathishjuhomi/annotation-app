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
import imageThree from '../../component/image3.jpg';
import Image from 'next/image'
import Paper from '@mui/material/Paper';

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
    <Box> <br></br>
      <Box className='flex flex-row'>
        <Paper elevation={5} className="max-w-4xl max-h-56 ml-14 mr-2 -mt-6 mb-2 flex flex-col  bg-white">
          <Typography className="text-black font-Inter font-bold text-left text-2xl ml-6 mt-6 leading-10 -tracking-1" component="h1" variant="h5">
            Sign Up
          </Typography>
          <br />
          <form onSubmit={formHandleSubmit(onSubmit)} noValidate>
            <Box className="mt-1 mr-2 flex flex-row">
              <Grid className="mb-1 ml-4 border-inherit border-1 rounded-none">
                <TextField
                  required
                  className="w-full-fourtyplus h-8"
                  id="email"
                  label="Email ID"
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
                  className="w-full-fourtyplus h-8"
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
                  className="w-full-fourtyplus h-8"
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
                variant="contained"
                className="text-white w-24 h-14 bg-button ml-2 mr-2 normal-case hover:bg-lightgreen"
              >
                Signup
              </Button>
            </Box>
            <Grid container justifyContent="flex-end" className="ml-4 mb-4 flex flex-col">
              <Grid className='flex flex-row'>
                <Typography className="font-Inter font-medium text-login mt-4 mr-1 text-sm leading-7">
                  Already have an account?
                </Typography>
                <Link
                  href="/signin"
                  variant="body2"
                  className="text-button font-Inter font-medium mr-1 mt-4 text-sm leading-7">
                  {" Login "}
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
        </Paper>
        <br></br>
      </Box>
      <div className="flex justify-end flex-row mt-3 mr-80 mb-3">
        <Image
          src={imageThree}
          alt='ImageThree'
          className="mr-2 w-72 h-40 rounded-2xl"
          quality={100}
          placeholder='blur'
        />
      </div>
      <br></br>
    </Box>
  );
}
