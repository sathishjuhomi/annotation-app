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
    <Box className="bg-grey display-flex">
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
        <div className="flex-grow hidden sm:block">
          <Typography
            variant="h6"
            component="div"
            className="text-white sm-sm md-md lg-lg xl-xl"
          >
            Maverick
          </Typography>
          </div>
          <div className="hidden sm:block">
          <Box>
            <Button className="text-white" onClick={navigateToSignIn}>
              Login
            </Button>
            <Button className="text-white" onClick={navigateToSignUp}>
              Sign Up
            </Button>
          </Box>
          </div>
        </Toolbar>
      </AppBar>
      <Box className="p-3" component="main">
        <Toolbar />
        <Typography
          className="text-white font-bold mt-20"
          variant="h2"
          gutterBottom
        >
          Build products faster
        </Typography>
        <div>
        <Typography
          sx={{ marginTop: "-20px" }}
          className="text-white font-bold"
          variant="h2"
          gutterBottom
        >
          in Next.js and Python
        </Typography>
        </div>
        <Typography
          variant="h5"
          gutterBottom
          className="text-white mt-10"
        >
          Maverick is the best Next.js and Python SaaS template out there. Focus
          on your business, not on the boilerplate.
        </Typography>
        <br />
        <br />
        <Button className="bg-primary text-white" variant="contained">Maverick your next app</Button>
        <br />
        <br />
      </Box>
    </Box>
  );
}
