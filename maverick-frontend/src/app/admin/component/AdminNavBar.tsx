"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { AppBar, Avatar, Collapse, Menu } from '@mui/material';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import Logo from '../../component/mavericklogo.jpg';
import Teams from '../../component/teams.jpg';
import Docs from '../../component/docs.jpg';
import Start from '../../component/start.jpg';
import Image from 'next/image';

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

    const [navBar, setNavBar] = React.useState("Installation")
    const [email, setEmail] = React.useState("")
    const [teamName, setTeamName] = React.useState("")
    useEffect(() => {
        const emailId = String(localStorage.getItem('emailId'));
        const teamNameValue = String(localStorage.getItem('teamName'));
        const navBarValue = String(localStorage.getItem('navBar'));
        console.log(navBarValue)
        setEmail(emailId)
        setTeamName(teamNameValue)
        setNavBar(navBarValue)
    }, []);

    const router = useRouter();
    const navigateToSubscription = () => {
        // localStorage.setItem('navBar', 'Installation')
        router.push("/admin/subscription");
    };
    const navigateToPlans = () => {
        // localStorage.setItem('navBar', 'Plans')
        router.push("/admin/plans");
    };
    const navigateToSignin = () => {
        // localStorage.setItem('navBar', 'Installation');
        // localStorage.setItem('access_token', "");
        router.push("/signin");
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openmenu = Boolean(anchorEl);
    const handleClickOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const drawer = (
        <Box className='mt-16 bg-grey overscroll-none'>
            <AppBar color='inherit' className='bg-white shadow'>
                <Toolbar>
                    <div className='mt-3'>
                        <Image
                            src={Logo}
                            alt='Maverick App'
                            className="h-6 w-44"
                            quality={100}
                            placeholder='blur'
                        />
                    </div>
                    <React.Fragment>
                        <Box className="ml-auto flex flex-row">
                            <Typography className="mt-3 text-black">{email ? email : ""}</Typography>
                            <Tooltip title={email} className='hover:bg-white'>
                                <IconButton
                                    onClick={handleClickOpen}
                                    className='bg-white hover:bg-white'
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={openmenu ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openmenu ? 'true' : undefined}
                                >
                                    <Avatar className="-ml-3 font-bold bg-git text-white">{email ? email[0].toUpperCase() : ""}</Avatar>
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={openmenu}
                            onClose={handleClose}
                            onClick={handleClose}>
                            {teamName !== 'null' &&
                                <Box>
                                    <MenuItem
                                        className='font-Inter font-normal bg-grey text-sm'
                                        onClick={handleClose}>
                                        {teamName}
                                    </MenuItem>
                                </Box>
                            }
                            <MenuItem
                                className="font-Inter font-normal bg-grey text-sm -mt-2"
                                onClick={navigateToSignin}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </React.Fragment>
                </Toolbar>
            </AppBar>
            <List>
                <ListItemButton onClick={handleClick}>
                    <Image
                        src={Start}
                        alt='Start'
                        className="w-6 h-6"
                        quality={100}
                        placeholder='blur'
                    />
                    <ListItemText className='ml-2 text-black font-Inter font-normal text-sm leading-6'>Admin Dashboard</ListItemText>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton
                            // className={navBar === "Installation" || navBar === "null" ?
                            //     "pl-4 bg-lightgrey"
                            //     :
                            //     "pl-4"
                            // }
                            onClick={navigateToSubscription}
                        >
                            <Image
                                src={Docs}
                                alt='Docs'
                                className="w-6 h-6"
                                quality={100}
                                placeholder='blur'
                            />
                            <ListItemText className='ml-2 text-greyplus font-Inter font-normal text-sm leading-6'>Subscription</ListItemText>
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton
                    // className={navBar === "Teams" ?
                    //     "pl-4 bg-lightgrey"
                    //     :
                    //     "pl-4"
                    // }
                    onClick={navigateToPlans}>
                    <Image
                        src={Teams}
                        alt='Teams'
                        className="w-6 h-6"
                        quality={100}
                        placeholder='blur'
                    />
                    <ListItemText className='ml-2 text-greyplus font-Inter font-normal text-sm leading-6'>Plans</ListItemText>
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <Box>
            <Box
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}>
            </Box>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: '#F7F6F6' }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}
