import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // Import the ThemeContext
import { auth } from '../JS Files/Firebase';
import toast, { Toaster } from 'react-hot-toast';
import { LightMode, DarkMode } from '@mui/icons-material'; // Import the icons
import { signOut } from 'firebase/auth';

const Header = () => {
    const { signin } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext); // Access theme and toggleTheme from context

    const Signout = async () => {
        await signOut(auth).then(() => {
            toast('Good Bye!', {
                icon: '👋',
                duration: 1500
              });
        }).catch((error) => {
            toast.error(error.errormessage);
        });
    }

    return (
        <AppBar position="static" color="primary" sx={{ borderRadius: '16px' }}>
            <Toaster />
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Car Garage
                </Typography>

                {!signin.userLoggedIn ?
                    <Box sx={{ display: { md: 'block' } }}>
                        <Link style={{ color: 'white', textDecoration: 'none' }} to={"/"}>
                            <Button color="inherit">Home</Button>
                        </Link>
                        <Link style={{ color: 'white', textDecoration: 'none' }} to={"/about"}>
                            <Button color="inherit">About</Button>
                        </Link>
                        <Link style={{ color: 'white', textDecoration: 'none' }} to={"/contact"}>
                            <Button color="inherit">Contact</Button>
                        </Link>
                    </Box> : null
                }

                {!signin.userLoggedIn ?
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Link style={{ color: 'white', textDecoration: 'none' }} to={"/signup"}>
                            <Button color="inherit" variant="outlined">
                                Signup
                            </Button>
                        </Link>
                        <Link style={{ color: 'white', textDecoration: 'none' }} to={"/login"}>
                            <Button color="inherit" variant="outlined" >
                                Login
                            </Button>
                        </Link>
                    </Box> : <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button color="inherit" variant="outlined" onClick={Signout}>
                            Signout
                        </Button>
                    </Box>
                }
            </Toolbar>
        </AppBar>
    );
};

export default Header;
