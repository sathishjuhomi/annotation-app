"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SignInProps } from "../../component/interfaces";
import Snackbar from "../../component/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

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
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box className="mt-8 flex flex-col items-center">
          <Avatar className="bg-blue m-1">
            <LockOutlinedIcon />
          </Avatar>
          <Typography className="text-black font-bold" component="h1" variant="h5">
            Sign in
          </Typography>
          <br />
          <form noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              onClick={formHandleSubmit(onSubmit)}
              variant="contained"
              className="bg-blue mb-2 mt-3 hover:bg-lightblue"
            >
              Sign in
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgot-password" variant="body2" className="text-black">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2" className="text-black">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          <Grid item>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleOauth}
              className= 'bg-red mb-2 mt-3 hover:bg-lightred'
            >
              Sign in with Google
            </Button>
          </Grid>
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
      </Container>
    </ThemeProvider>
  );
}
