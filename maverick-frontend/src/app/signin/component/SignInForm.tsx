"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import { SignInProps } from "../../component/interfaces";
import Snackbar from "../../component/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import imageThree from '../../component/image3.jpg';
import google from '../../component/google.jpg';
import Image from 'next/image';
import Paper from "@mui/material/Paper";
import { useRouter } from "next/navigation";

const defaultTheme = createTheme();

export default function Signin({
  loading,
  showMessage,
  setShowMessage,
  message,
  messageColor,
  onSubmit,
  formHandleSubmit,
  handleOauth,
  register,
  errors,
}: SignInProps) {

  const router = useRouter();
  const navigateToSignUp = () => {
    router.push("/signup");
  };
  const navigateToForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <Box> <br></br>
      <Box className='flex flex-row'>
        <Paper elevation={5} className="w-paper max-h-56 ml-14 mr-2 -mt-5 mb-2 flex flex-col  bg-white">
          <Typography className="text-black font-Inter font-bold text-left text-2xl ml-6 mt-6 leading-10 -tracking-1" component="h1" variant="h5">
            Login
          </Typography>
          <br />
          <form noValidate>
            <Box className="mt-1 mr-2 flex flex-row">
              <Grid item>
                <Button
                  type="submit"
                  style={{ width: '214px', height: '55px' }}
                  onClick={handleOauth}
                  startIcon={<Image
                    src={google}
                    alt='Google'
                    className="w-6 h-8"
                    quality={100}
                    placeholder='blur'
                  />}
                  className='w-52 h-16 bg-border text-black normal-case font-Inter mb-1 ml-6 hover:bg-lightgrey'
                >
                  Login with Google
                </Button>
              </Grid>
              <Typography className="mt-4 ml-2 font-Inter font-normal text-sm"> OR </Typography>
              <Grid className="mb-1 ml-2 border-inherit border-1 rounded-none">
                <TextField
                  required
                  className="w-full-fourty h-16"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  {...register("email")}
                  error={Boolean(errors?.email)}
                  helperText={errors?.email ? errors?.email.message : " "}
                />
              </Grid>
              <Grid className="mb-1 ml-2 border-inherit border-1 rounded-none">
                <TextField
                  required
                  className="w-full-fourty h-16"
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
              <Button
                type="submit"
                color="inherit"
                onClick={formHandleSubmit(onSubmit)}
                variant="contained"
                className="text-white w-button h-14 bg-button ml-2 normal-case hover:bg-lightgreen"
              >
                Login
              </Button>
            </Box>
            <Box className="mt-1 flex flex-row">
              <Grid className='flex flex-row ml-3'>
                <Typography className="font-Inter font-medium text-greyplus ml-4 mt-4 mr-1 text-sm leading-7">
                  Don't have an account?
                </Typography>
                <Button 
                  className="text-button font-Inter font-semibold normal-case mt-0 -ml-2 text-sm leading-7 mr-56"
                  onClick={navigateToSignUp}
                >
                  Register here
                </Button>
              </Grid>
              <Grid className="flex justify-end ms-88 mb-4">
                <Button
                  className="font-Inter font-medium text-greyplus normal-case mt-2 ml-72 -mr-4"
                  onClick={navigateToForgotPassword}
                >
                  Forgot Password
                </Button>
              </Grid>
            </Box>
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
          className="mr-4 w-72 h-40 rounded-2xl"
          quality={100}
          placeholder='blur'
        />
      </div>
      <br></br>
    </Box>
  );
}
