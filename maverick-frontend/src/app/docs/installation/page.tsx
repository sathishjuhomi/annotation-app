"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import NavBar from "../../component/NavBar";

export default function Install() {

  return (
    <Box className="flex">
      <NavBar></NavBar>
      <Box component="main" className="mt-10"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
        <Typography className="-ml-3 font-Intern font-bold text-xl leading-8 p-3 text-black">
          Welcome to Maverick
        </Typography>
        <Typography className="text-black text-sm font-Inter font-normal mb-2 -p-2">
          You can clone Maverick from our Git repository and merge updates at
          any time.
        </Typography>
        <Paper elevation={3} className="bg-white">
          <Typography className="ml-4 p-3 font-Inter font-bold leading-6 text-base text-black">
            Using Maverick with Git
          </Typography>
          <Typography className="ml-7 font-Inter font-normal text-sm text-black leading-6">
            Git provides an easy way to merge changes from Maverick into your application.
          </Typography>
          <Typography className="ml-7 font-Inter font-normal text-sm text-black leading-6">
            This is handy when new features or improvements are added to Maverick and you'd like
          </Typography>
          <Typography className="ml-7 font-Inter font-normal text-sm text-black leading-6">
            to merge them into your application.
          </Typography>
          <Typography className="ml-4 p-3 font-Inter font-bold leading-6 text-base text-black">
            Clone The Repository
          </Typography>
          <Typography className="ml-7 font-Inter font-normal text-sm text-black leading-6">
            First, you'll need to clone Maverick from GitHub when you create your application.
          </Typography>
          <Typography className="ml-7 font-Inter font-normal text-sm text-black leading-6">
            We'll call our application my-app, but you should change it to your application name.
          </Typography>
          <Box>
            <Paper className="bg-git ml-7 mt-2 mr-4" elevation={5}>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="text-white pl-10"
              >
                git clone git@github.com:juhomi/maverick.git my-app
              </Typography>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="text-white pl-10"
              >
                cd my-app
              </Typography>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="text-white pl-10"
              >
                git remote rename origin maverick
              </Typography>
            </Paper>
          </Box>
          <Typography className="ml-4 p-3 font-Inter font-bold leading-6 text-base text-black">
            Create Your Git Repository
          </Typography>
          <Button
            variant="contained"
            target="_blank"
            href="https://github.com/new"
            className="ml-7 text-white bg-green hover:bg-lightgreen"
          >
            Github
          </Button>
          <Typography className="ml-7 p-1 font-Inter font-normal text-sm text-black leading-6">
            We can then set origin to point to our new repository and push the
            black up to it.
          </Typography>
          <Box>
            <Paper className="bg-git ml-7 mt-2 mr-4" elevation={5}>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="text-white pl-10"
              >
                git remote add origin
                git@github.com:your-account/your-new-repo.git
              </Typography>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="text-white pl-10"
              >
                git push -u origin main
              </Typography>
            </Paper>
          </Box>
          <Typography className="ml-4 p-3 font-Inter font-bold leading-6 text-base text-black">
            Merging updates from Maverick
          </Typography>
          <Typography className="ml-7 p-1 font-Inter font-normal text-sm text-black leading-6">
            Then We can use git to fetch and merge updates into your application.
          </Typography>
          <Box>
            <Paper className="bg-git ml-7 mt-2 mr-4" elevation={5}>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="text-white pl-10"
              >
                git fetch maverick
              </Typography>
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="text-white pl-10"
              >
                git merge maverick/main
              </Typography>
            </Paper>
          </Box>
          <br></br>
        </Paper>
      </Box>
    </Box>
  );
}
