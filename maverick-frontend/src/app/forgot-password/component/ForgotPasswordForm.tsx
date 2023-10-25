"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SignUpProps } from "../../component/interfaces";
import Snackbar from "../../component/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

const defaultTheme = createTheme();

export default function ForgotPassword({
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
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box className="mt-8 flex flex-col items-center">
          <Typography className="text-black font-bold mt-4" component="h1" variant="h5">
            Forgot Password
          </Typography>
          <br />
          <form onSubmit={formHandleSubmit(onSubmit)} noValidate>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="bg-blue mb-2 mt-3 hover:bg-lightblue"
            >
              Forgot Password
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signin" variant="body2" className="text-black">
                  {"Back to Sign In"}
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
      </Container>
    </ThemeProvider>
  );
}
