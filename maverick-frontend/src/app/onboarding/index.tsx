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

  const navigateToSignUp = () => {
    router.push("/signup");
  };

  return (
    <Box className="bg-white display-flex bg-lightgrey">
      <CssBaseline />
      {/* <AppBar component="nav" className="bg-lightgrey"> */}
        <Toolbar>
          <div className="flex-grow hidden sm:block">
            <Typography
              variant="h6"
              component="div"
              className="text-green sm-sm md-md lg-lg xl-xl"
            >
              Maverick
            </Typography>
          </div>
          <div className="hidden sm:block">
            <Box>
              <Button className="text-black mr-2 hover:bg-lightgrey" onClick={navigateToSignIn}>
                Log In
              </Button>
              <Button 
              className="text-black bg-white hover:bg-lightgrey" 
              onClick={navigateToSignUp}
              >
                Sign Up
              </Button>
            </Box>
          </div>
        </Toolbar>
      {/* </AppBar> */}
      <Box className="p-3" component="main">
        {/* <Toolbar /> */}
        <Typography
          className="text-black font-bold mt-10"
          variant="h2"
          gutterBottom
        >
          Accelerate product development
        </Typography>
        <div>
          <Typography
            sx={{ marginTop: "-20px" }}
            className="text-black font-bold"
            variant="h2"
            gutterBottom
          >
            in Next.js and Python
          </Typography>
        </div>
        <Typography variant="h5" gutterBottom className="text-black mt-10">
          Maverick stands out as the top Next.js and Python SaaS template available.
          Concentrate on your business, not on the initial setup and repetitive tasks.
        </Typography>
        <br />
        <br />
        {/* <Button className="bg-edit text-white hover:bg-lightblack" variant="contained">
          Maverick your next app
        </Button>
        <br />
        <br /> */}
      </Box>
    </Box>
  );
}
