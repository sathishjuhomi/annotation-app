import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
import { useRouter } from "next/navigation";

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

  const router = useRouter();
  const navigateToSignIn = () => {
    router.push("/signin");
  };

  return (
    <Box> <br></br>
      <Box className='flex flex-row'>
        <Paper elevation={5} className="w-full-sixty max-h-7xl ml-8 mr-8 mt-28 mb-8 flex flex-col  bg-white">
          <Typography className="text-black font-Inter font-bold text-left text-3xl ml-6 mt-6 leading-10 -tracking-1">
            Sign Up
          </Typography>
          <br />
          <form onSubmit={formHandleSubmit(onSubmit)} noValidate>
            <Box className="ml-2 mr-2 flex flex-col">
              <Grid className="ml-2 mr-2 border-inherit border-1 rounded-none">
                <TextField
                  required
                  className="w-full"
                  id="email"
                  label="Email ID"
                  name="email"
                  autoComplete="email"
                  {...register("email")}
                  error={Boolean(errors?.email)}
                  helperText={errors?.email ? errors?.email.message : " "}
                />
              </Grid>
              <Grid className="ml-2 mr-2 border-inherit border-1 rounded-none">
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
              <Grid className="ml-2 mr-2 border-inherit border-1 rounded-none">
                <TextField
                  required
                  className="w-full"
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
                className="text-white w-full-fivesixty h-20 bg-button ml-2 mr-2 mt-2 font-Inter font-bold text-lg leading-8 normal-case hover:bg-lightgreen"
              >
                Signup
              </Button>
            </Box>
              <Grid className='ml-2 mb-5 flex flex-row items-center justify-center'>
                <Typography className="font-Inter font-medium text-greyplus mt-8 mr-1 text-xl leading-9">
                  Already have an account?
                </Typography>
                <Button
                  className="text-button font-Inter normal-case font-bold mt-8 -ml-2 text-xl leading-9"
                  onClick={navigateToSignIn}
                >
                  Login
                </Button>
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
