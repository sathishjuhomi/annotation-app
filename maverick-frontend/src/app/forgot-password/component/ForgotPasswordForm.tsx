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
import { ForgotPasswordData } from "../interfaces";
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
}: ForgotPasswordData) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
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
              sx={{ mt: 3, mb: 2 }}
            >
              Forgot Password
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signin" variant="body2">
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
