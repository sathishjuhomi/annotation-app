"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

   const handleClick = () => {
     setOpen(!open);
   };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary="Get Started" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton className="pl-4">
              <ListItemText primary="Installation" />
            </ListItemButton>
            <ListItemButton className="pl-4">
              <ListItemText primary="Teams" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className="flex ml-2 mr-2">
    <Box className="sm-sm md-md lg-lg xl-xl">
      <CssBaseline />
      <div>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="mr-2 hidden sm:block"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="text-white flex sm-sm md-md lg-lg xl-xl" noWrap component="div">
            Welcome to Maverick
          </Typography>
        </Toolbar>
      </AppBar>
      </div>
      <Box
        component="nav"
        className="w-full sm-sm flex-shrink-0"
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Typography paragraph className="text-black text-canter">
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
    </Box>
    </div>
  );
}
