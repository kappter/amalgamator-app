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
  Alert
} from '@mui/material';
import { authSuccess } from '../redux/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In a real implementation, this would call the API service
      // For now, we'll simulate a successful login
      setTimeout(() => {
        dispatch(authSuccess({ token: 'sample-token' }));
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login to Amalgamator
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/register" variant="body2">
                Don't have an account? Register
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
