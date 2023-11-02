"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Logo from '../component/mavericklogo.jpg';
import imageOne from '../component/image1.jpg';
import imageTwo from '../component/image2.jpg';
import Image from 'next/image'


export default function Onboarding() {
  const router = useRouter();
  const navigateToSignIn = () => {
    router.push("/signin");
  };

  const navigateToSignUp = () => {
    router.push("/signup");
  };

  return (
    <Box className="display-flex">
      <Toolbar>
        <div className="flex-grow p-8 hidden sm:block">
          <Image
            src={Logo}
            alt='Maverick App'
            className="h-6 w-44"
            quality={100}
            placeholder='blur'
          />
        </div>
        <div className="hidden sm:block">
          <Button className="text-greyplus font-medium font-Inter text-base leading-8 normal-case mr-2 hover:bg-lightgrey" onClick={navigateToSignUp}>
            Sign Up
          </Button>
          <Button
            className="text-greyplus font-medium font-Inter text-base leading-8 normal-case hover:bg-lightgrey"
            onClick={navigateToSignIn}
          >
            Login
          </Button>
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
          </Typography>
          <Typography
            className="text-black font-Inter font-bold text-left text-4xl -mt-4 leading-10 -tracking-1 "
            variant="h2"
            gutterBottom
          >
            development in Next.js
          </Typography>
          <Typography
            className="text-black font-Inter font-bold text-left text-4xl -mt-4 leading-10 -tracking-1 "
            variant="h2"
            gutterBottom
          >
            and Python
          </Typography>
          <Typography className="text-black font-Inter font-normal text-left text-lg leading-7 tracking-normal">
            Maverick stands out as the top Next.js and Python
          </Typography>
          <Typography className="text-black font-Inter font-normal text-left text-lg -mt-1 leading-7 tracking-normal">
            SaaS template available.Concentrate on your business
          </Typography>
          <Typography className="text-black font-Inter font-normal text-left text-lg -mt-1 leading-7 tracking-normal">
            not on the initial setup and repetitive tasks
          </Typography>
        </Box>
        <div className="ml-40 -mb-10 ">
          <Image
            src={imageOne}
            alt='ImageOne'
            className="ml-11 w-image1 max-h-80 rounded-2xl"
            quality={100}
            placeholder='blur'
          />
        </div>
      </Box>
      <div className="flex justify-end flex-row mt-12 -mb-96 mr-5">
        <Image
          src={imageTwo}
          alt='ImageTwo'
          className="w-72 max-h-96 mt-2 rounded-2xl"
          quality={100}
          placeholder='blur'
        />
      </div>
    </Box>
  );
}
