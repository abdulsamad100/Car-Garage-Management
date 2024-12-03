import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Car Garage!
        </Typography>
        <Typography variant="body1" paragraph>
          Get your car repaired Easily and with lowest price possible.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
