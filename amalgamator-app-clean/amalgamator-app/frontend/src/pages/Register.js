import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { authSuccess } from '../redux/slices/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    socialMediaLink: '',
    educationLevel: '',
    age: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { 
    username, 
    email, 
    password, 
    confirmPassword, 
    socialMediaLink, 
    educationLevel, 
    age, 
    location 
  } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, this would call the API service
      // For now, we'll simulate a successful registration
      setTimeout(() => {
        dispatch(authSuccess({ token: 'sample-token' }));
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError('Registration failed');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 8, mb: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Join Amalgamator
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Create an account to start exploring concept connections
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                name="username"
                value={username}
                onChange={handleChange}
                required
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Social Media Link"
                name="socialMediaLink"
                value={socialMediaLink}
                onChange={handleChange}
                required
                fullWidth
                placeholder="e.g., https://twitter.com/username"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Education Level</InputLabel>
                <Select
                  name="educationLevel"
                  value={educationLevel}
                  onChange={handleChange}
                  label="Education Level"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="High School">High School</MenuItem>
                  <MenuItem value="Associate's">Associate's Degree</MenuItem>
                  <MenuItem value="Bachelor's">Bachelor's Degree</MenuItem>
                  <MenuItem value="Master's">Master's Degree</MenuItem>
                  <MenuItem value="Doctorate">Doctorate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Age"
                type="number"
                name="age"
                value={age}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Location"
                name="location"
                value={location}
                onChange={handleChange}
                fullWidth
                placeholder="City, Country"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
