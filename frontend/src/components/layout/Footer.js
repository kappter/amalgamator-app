import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Amalgamator - Explore connections between concepts'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link color="inherit" href="/">
            Home
          </Link>{' | '}
          <Link color="inherit" href="/explorer">
            Explorer
          </Link>{' | '}
          <Link color="inherit" href="/about">
            About
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
