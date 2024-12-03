import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Container>
      <Toaster/>
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions, feel free to reach out to us using the form below.
        </Typography>

        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <TextField
            fullWidth
            required
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            label="Your Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Contact;
