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
        <Paper elevation={5} className="w-full-sixty h-full-plus ml-8 mr-12 mt-28 mb-8 flex flex-col  bg-white">
          <Typography className=" ml-10 mt-10 text-black font-Inter font-bold text-left text-3xl leading-10 -tracking-1">
            Login
          </Typography>
          <br />
          <form noValidate>
            <Box className="ml-2 mr-8 flex flex-col">
              <Grid item>
                <Button
                  type="submit"
                  style={{ width: '560px', height: '55px' }}
                  onClick={handleOauth}
                  startIcon={<Image
                    src={google}
                    alt='Google'
                    className="w-11 h-11"
                    quality={100}
                    placeholder='blur'
                  />}
                  className='max-w-xl h-24 mb-1 ml-6 bg-border text-black text-lg normal-case font-Inter font-semibold hover:bg-lightgrey'
                >
                  Login with Google
                </Button>
              </Grid>
              <Typography className="mt-6 flex flex-row items-center justify-center text-lightgrey font-Inter font-semibold text-sm"> OR </Typography>
              <Grid className="mt-4 ml-6 border-inherit border-1 rounded-none">
                <TextField
                  required
                  className="w-full"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  {...register("email")}
                  error={Boolean(errors?.email)}
                  helperText={errors?.email ? errors?.email.message : " "}
                />
              </Grid>
              <Grid className="ml-6 border-inherit border-1 rounded-none">
                <TextField
                  required
                  className="w-full"
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
                className="text-white w-full-fivesixty h-20 bg-button ml-6  mt-2 font-Inter font-bold text-2xl leading-8 normal-case hover:bg-lightgreen"
              >
                Login
              </Button>
            </Box>
            <Box className="mt-8 flex flex-col items-center justify-center">
                <Button
                  className="font-Inter font-medium text-greyplus text-xl leading-9 normal-case"
                  onClick={navigateToForgotPassword}
                >
                  Forgot Password ?
                </Button>
              <Grid className='mt-6 flex flex-row items-center justify-center'>
                <Typography className="font-Inter font-medium text-greyplus text-xl leading-9">
                  Don't have an account?
                </Typography>
                <Button
                  className="text-button font-Inter font-semibold normal-case text-xl leading-9 hover:bg-white"
                  onClick={navigateToSignUp}
                >
                  Register here
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
            <Box
              className="text-greyplus mt-2 flex justify-center items-center"
            >
              <CircularProgress color="inherit" />
            </Box>
          ) : null}
        </Paper>
        <br></br>
      </Box>
    </Box>
  );
}
