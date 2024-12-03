import React, { useRef } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from '../JS Files/Firebase'; 
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';

const SignupForm = () => {
  const navigate = useNavigate();
  const formValues = useRef({
    username: '',
    email: '',
    password: '',
  });

  const signUpUser = async (ev) => {
    ev.preventDefault();

    if (!formValues.current.username || !formValues.current.email || !formValues.current.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.current.email,
        formValues.current.password
      );

      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        username: formValues.current.username,
        email: formValues.current.email,
        password: formValues.current.password,
      });

      toast.success("User registered successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Error:", error.message);
      const errormessage=error.message;
      if (errormessage == "Firebase: Error (auth/invalid-email)."){
        toast.error(`Kindly type Correct Email Format`);
        return
      }
      if (errormessage == "Firebase: Error (auth/email-already-in-use)."){
        toast.error(`Email already in use kindly use Login`);
        return
      }
      if (errormessage == "Firebase: Password should be at least 6 characters (auth/weak-password)."){
        toast.error(`Password Must be Atleast 6 Letter`);
        return
      }
      if (errormessage == "Firebase: Error (auth/invalid-email)."){
        toast.error(`Error: ${error.message}`);
        return
      } 
      
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formValues.current = { ...formValues.current, [name]: value };
  };

  return (
    <Container>
      <Toaster/>
      <Box sx={{ py: 5, textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={signUpUser}>
          <TextField
            fullWidth
            required
            autoComplete="off"  // Disable autocomplete to prevent autofill issues
            label="Full Name"
            name="username"
            type="text"
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            autoComplete="off"
            label="Email"
            name="email"
            type="email"
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            autoComplete="off"
            label="Password"
            name="password"
            type="password"
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignupForm;
