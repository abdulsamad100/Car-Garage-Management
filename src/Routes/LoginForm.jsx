import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { auth } from '../JS Files/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';
import { ThemeContext } from '../context/ThemeContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginForm = () => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.dismiss(loadingToast);
      toast.success("Signed in successfully!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Email/Password is incorrect");
    }
  };

  return (
    <Container>
      <Box
        sx={{
          py: 5,
          textAlign: 'center',
          maxWidth: '400px',
          margin: '0 auto',
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#000',
          borderRadius: 2,
          marginTop: "20px"
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: theme === 'dark' ? '#555' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
            }}
          />
          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: theme === 'dark' ? '#555' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end" >
                    {showPassword ? <VisibilityOff sx={{background:"none"}} /> : <Visibility sx={{background:"none"}} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
