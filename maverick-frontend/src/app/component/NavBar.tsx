"use client";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, Menu } from '@mui/material';
import { useRouter } from "next/navigation";

const drawerWidth = 240;

interface Props {
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
    const navigateToSignin = () => {
        sessionStorage.setItem('access_token', "");
        router.push("/signin");
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

    const container = window !== undefined ? () => window().document.body : undefined;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openmenu = Boolean(anchorEl);
    const handleClickOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const email = sessionStorage.getItem("emailId");
    const teamName = sessionStorage.getItem("teamName")

    return (
        <Box>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    background: "#000000"
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
                    <Typography variant="h6" noWrap component="div" className="font-bold text-white">
                        Welcome to Maverick
                    </Typography>
                    <React.Fragment>
                        <Box className="ml-auto">
                            <Tooltip title={email}>
                                <IconButton
                                    onClick={handleClickOpen}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={openmenu ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openmenu ? 'true' : undefined}
                                >
                                    <Avatar className="font-bold">{email ? email[0].toUpperCase() : ""}</Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Menu anchorEl={anchorEl}
                            id="account-menu"
                            open={openmenu}
                            onClose={handleClose}
                            onClick={handleClose}>
                            {teamName ?
                                <Box>
                                    <MenuItem onClick={handleClose}>
                                        {teamName}
                                    </MenuItem>
                                    <Divider />
                                </Box>
                                : null
                            }
                            <MenuItem onClick={navigateToSignin}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                // TO do: className="w-full sm:w-{your-sm-width} flex-shrink-0"
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
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}
