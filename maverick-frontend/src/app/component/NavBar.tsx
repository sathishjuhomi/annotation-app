// import React from "react";
// import AppBar from "@mui/material/AppBar";
// import Drawer from "@mui/material/Drawer";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import Typography from "@mui/material/Typography";
// import List from "@mui/material/List";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemText from "@mui/material/ListItemText";
// import { useRouter } from "next/navigation";

// const drawerWidth = 240;

// interface Props {
//   children: React.ReactNode;
// }

// const Layout: React.FC<Props> = ({ children }) => {

//   const router = useRouter();

//   const navigateToInstallation = () => {
//     router.push("/docs/installation");
//   }
//   const navigateToTeams = () => {
//     router.push("/newteam");
//   };

//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <div style={{ display: "flex" }}>
//       {/* Drawer */}
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//         }}
//         open
//       >
//         <Toolbar />
//         <List>
//           <ListItemButton onClick={navigateToInstallation}>
//             <ListItemText primary="Installation" />
//           </ListItemButton>
//           <ListItemButton onClick={navigateToTeams}>
//             <ListItemText primary="Teams" />
//           </ListItemButton>
//         </List>
//       </Drawer>

//       {/* Main Content */}
//       <div style={{ flexGrow: 1 }}>
//         <AppBar position="fixed">
//           <Toolbar>
//             {/* Add your app title or logo here */}
//             <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             className="mr-2 hidden sm:block"
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" className="text-white flex sm-sm md-md lg-lg xl-xl" noWrap component="div">
//             Welcome to Maverick APP
//           </Typography>
//           </Toolbar>
//         </AppBar>
//         <div style={{ marginTop: 64, padding: 16 }}>
//           {/* Content */}
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;


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
import { useRouter } from "next/navigation";

const drawerWidth = 150;

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
  
    const router = useRouter(); 
    
    const navigateToInstallation = () => {
        router.push("/docs/installation");
    };
    const navigateToTeams = () => {
      router.push("/teams"); 
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
              <ListItemButton className="pl-4" onClick={navigateToInstallation}>
                <ListItemText primary="Installation" />
              </ListItemButton>
              <ListItemButton className="pl-4" onClick={navigateToTeams}>
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
        </Box>
      </Box>
      </div>
    );
  }