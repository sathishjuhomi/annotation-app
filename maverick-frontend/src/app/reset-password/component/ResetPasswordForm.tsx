"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
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
import Paper from "@mui/material/Paper";
import { useRouter } from "next/navigation";

const defaultTheme = createTheme();

export default function ResetPassword({
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

  const router = useRouter();
  const navigateToSignIn = () => {
    router.push("/signin");
  };

  return (
    <Box> <br></br>
      <Box className='flex flex-row'>
        <Paper elevation={5} className="w-paper max-h-56 ml-14 mr-2 -mt-6 mb-2 flex flex-col  bg-white">
          <Typography className="text-black font-Inter font-bold text-left text-2xl ml-6 mt-6 leading-10 -tracking-1" component="h1" variant="h5">
            Reset Password
          </Typography>
          <br />
          <form onSubmit={formHandleSubmit(onSubmit)} noValidate>
            <Box className="mt-1 mr-2 flex flex-row">
              <Grid className="mb-1 ml-4 border-inherit border-1 rounded-none">
                <TextField
                  required
                  className="w-full-reset h-16 ml-2"
                  name="password"
                  label="New Password"
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
                  className="w-full-reset h-16 ml-2"
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
                color="inherit"
                variant="contained"
                className="text-white w-button3 h-14 bg-button ml-4 mr-2 normal-case hover:bg-lightgreen"
              >
                Reset Password
              </Button>
            </Box>
            <Grid className="flex justify-end mt-0 mb-4 mr-5">
              <Grid item>
                <Button
                  className="mr-2 text-greyplus font-Inter normal-case font-medium text-sm leading-7"
                  onClick={navigateToSignIn}
                >
                  Back to Login
                </Button>
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
            <Box
            className='text-greyplus mt-2 flex justify-center items-center'
          >
            <CircularProgress color="inherit"/>
          </Box>
          ) : null}
        </Paper>
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
