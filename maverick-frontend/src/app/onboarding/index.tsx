"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";


export default function Onboarding() {
  const router = useRouter();
  const navigateToSignIn = () => {
    router.push("/signin");
  };

  const navigateToSignUp= () => {
    router.push("/signup");
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#303030",
      }}
    >
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Maverick
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button sx={{ color: "#fff" }} onClick={navigateToSignIn}>
              Login
            </Button>
            <Button sx={{ color: "#fff" }} onClick={navigateToSignUp}>
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Typography
          sx={{ color: "#fff", marginTop: "30px" }}
          variant="h2"
          gutterBottom
        >
          Build products faster
        </Typography>
        <Typography
          sx={{ color: "#fff", marginTop: "-30px" }}
          variant="h2"
          gutterBottom
        >
          in Next.js and Python
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#fff", marginTop: "20px" }}
        >
          Maverick is the best Next.js and Python SaaS template out there. Focus
          on your business, not on the boilerplate.
        </Typography>
        <br />
        <br />
        <Button variant="contained">Maverick your next app</Button>
        <br />
        <br />
      </Box>
    </Box>
  );
}
