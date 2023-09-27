"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Layout from "../../component/NavBar";

export default function Install() {

  return (
    <div className="flex m-1 ml-16">
    <Box className="ms-19 ml-24 sm-sm md-md lg-lg xl-xl">
      <CssBaseline />
      <Layout></Layout>
        <Typography paragraph className="text-black">
          You can clone Maverick from our Git repository and merge updates at
          any time.
        </Typography>
        <Typography variant="h5" className="text-black" gutterBottom>
          Using Maverick with Git
        </Typography>
        <br></br>
        <Typography className="text-black">
          Git provides an easy way to merge changes from Maverick into your
          application. This is handy when new features or improvements are added
          to Maverick and you'd like to merge them into your application.
        </Typography>
        <br></br>
        <Typography className="text-black" variant="h5" gutterBottom>
          Clone The Repository
        </Typography>
        <br></br>
        <Typography paragraph className="text-black">
          First, you'll need to clone Maverick from GitHub when you create your
          application. We'll call our application my-app, but you should change
          it to your application name.
        </Typography>
        <br></br>
        <Box>
          <Paper className="bg-black" elevation={3}>
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

        <br></br>
        <Typography variant="h5" className="text-black" gutterBottom>
          Create Your Git Repository
        </Typography>
        <br></br>
        <Button
          variant="outlined"
          target="_blank"
          href="https://github.com/new"
          className="text-primary"
        >
          Github
        </Button>
        <br></br>
        <br></br>
        <Typography className="text-black">
          We can then set origin to point to our new repository and push the
          code up to it.
        </Typography>
        <br></br>
        <Box>
          <Paper className="bg-black" elevation={3}>
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
        <br></br>
        <Typography variant="h5" className="text-black" gutterBottom>
          Merging updates from Maverick
        </Typography>
        <br></br>
        <Typography className="text-black">
          Then We can use git to fetch and merge updates into your application.
        </Typography>
        <br></br>
        <Box>
          <Paper className="bg-black" elevation={3}>
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
    </Box>
    </div>
  );
}
