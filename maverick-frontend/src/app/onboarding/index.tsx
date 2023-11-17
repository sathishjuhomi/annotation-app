"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Logo from '../component/mavericklogo.jpg';
import Image from 'next/image'
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';


export default function Onboarding() {
  const router = useRouter();
  const navigateToSignIn = () => {
    router.push("/signin");
  };

  const navigateToSignUp = () => {
    router.push("/signup");
  };

  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box className="display-flex">
      <Toolbar>
        <div className="flex-grow p-8 hidden sm:flex justify-center items-center">
          <Image
            src={Logo}
            alt='Maverick App'
            className="h-6 w-44"
            quality={100}
            placeholder='blur'
          />
        </div>
        <div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="mr-2 hidden sm:block"
          >
            <MenuIcon />
          </IconButton>
        </div>
      </Toolbar>
      <Box className="flex flex-row ">
        <Box className="flex flex-col box-border max-w-lg max-h-36 mt-16 ml-14">
          <Typography
            className="text-black font-Inter font-bold text-left text-4xl leading-10 -tracking-1 "
            variant="h2"
            gutterBottom
          >
            Accelerate product
            <br />
            development in Next.js
            <br />
            and Python
          </Typography>
          <Typography className="text-black font-Inter font-normal text-left text-lg leading-7 tracking-normal">
            Maverick stands out as the top Next.js
            <br />
            and Python SaaS template available.
            <br />
            Concentrate on your business not on
            <br />
            the initial setup and repetitive tasks
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
