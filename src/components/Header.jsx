import React, { useContext, useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Drawer, List, ListItem, ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../JS Files/Firebase';
import toast, { Toaster } from 'react-hot-toast';
import { signOut } from 'firebase/auth';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
    const { signin } = useContext(AuthContext);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const Signout = async () => {
        await signOut(auth)
            .then(() => {
                toast('Good Bye!', {
                    icon: '👋',
                    duration: 1500,
                });
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#1976d2',
                color: '#fff',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                borderRadius: '16px',
                paddingX: 2,
            }}
        >
            <Toaster />
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Logo Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Car Garage
                    </Typography>
                    {signin.userLoggedIn && (
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: 'lightgreen',
                            }}
                        />
                    )}
                </Box>

                <IconButton
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                    }}
                    onClick={handleDrawerToggle}
                >
                    <MenuIcon sx={{ color: '#fff' }} />
                </IconButton>

                <Box
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        gap: 4,
                        alignItems: 'center',
                    }}
                >
                    {!signin.userLoggedIn ? (
                        <>
                            <Link style={{ textDecoration: 'none' }} to="/signup">
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        ':hover': {
                                            backgroundColor: '#1565c0',
                                            color: '#fff',
                                        },
                                    }}
                                >
                                    Signup
                                </Button>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} to="/login">
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        ':hover': {
                                            backgroundColor: '#1565c0',
                                            color: '#fff',
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                            </Link>
                        </>
                    ) : signin.isAdmin ? (
                        /* Admin Options */
                        <>
                            <Link style={{ textDecoration: 'none' }} to="/dashboard">
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Home
                                </Button>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} to="/confirmedappointments">
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Appointments
                                </Button>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} to="/admin-dashboard">
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Chat
                                </Button>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} to="/admin-dashboard">
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Stock
                                </Button>
                            </Link>
                            <IconButton onClick={Signout} sx={{ p: 0 }}>
                                <Avatar alt="Admin Avatar" src="/path-to-admin-avatar.png" />
                            </IconButton>
                        </>
                    ) : (
                        /* Regular User Options */
                        <>
                            <Link style={{ textDecoration: 'none' }} to="/dashboard">
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Book Appointment
                                </Button>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} to="/myappointments">
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    My Appointments
                                </Button>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} to="/dashboard">
                                <Button
                                    variant="text"
                                    sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Chat
                                </Button>
                            </Link>
                            <IconButton onClick={Signout} sx={{ p: 0 }}>
                                <Avatar alt="User Avatar" src="/path-to-user-avatar.png" />
                            </IconButton>
                        </>
                    )}
                </Box>
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{ display: { xs: 'block', sm: 'none' } }}
            >
                <Box sx={{ width: 250, padding: 2 }}>
                    <List>
                        {!signin.userLoggedIn ? (
                            <>
                                <ListItem button onClick={handleDrawerToggle}>
                                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                                        <ListItemText primary="Signup" />
                                    </Link>
                                </ListItem>
                                <ListItem button onClick={handleDrawerToggle}>
                                    <Link to="/login" style={{ textDecoration: 'none' }}>
                                        <ListItemText primary="Login" />
                                    </Link>
                                </ListItem>
                            </>
                        ) : signin.isAdmin ? (
                            <>
                                <ListItem button onClick={handleDrawerToggle}>
                                    <Link to="/admin-dashboard" style={{ textDecoration: 'none' }}>
                                        <ListItemText primary="Admin Panel" />
                                    </Link>
                                </ListItem>
                                <ListItem button onClick={Signout}>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </>
                        ) : (
                            <>
                                <ListItem button onClick={handleDrawerToggle}>
                                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                        <ListItemText primary="Book Appointment" />
                                    </Link>
                                </ListItem>
                                <ListItem button onClick={handleDrawerToggle}>
                                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                        <ListItemText primary="My Appointments" />
                                    </Link>
                                </ListItem>
                                <ListItem button onClick={handleDrawerToggle}>
                                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                        <ListItemText primary="Chat" />
                                    </Link>
                                </ListItem>
                                <ListItem button onClick={Signout}>
                                    <ListItemText primary="Logout" />
                                </ListItem>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
};

export default Header;
