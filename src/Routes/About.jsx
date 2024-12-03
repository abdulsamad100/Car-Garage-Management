import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const About = () => {
  return (
    <Container>
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          About MyApp
        </Typography>
        <Typography variant="body1" paragraph>
          MyApp is a modern platform designed to help you manage your tasks efficiently and stay productive. 
          We believe in providing a user-friendly experience with intuitive design and powerful features.
        </Typography>
        <Typography variant="body1" paragraph>
          Our team is committed to continuously improving the platform to meet the evolving needs of our users. 
          Whether you're an individual looking to organize your day or a team seeking better collaboration, 
          MyApp has the tools you need to succeed.
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for choosing MyApp. We are excited to be part of your productivity journey!
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
