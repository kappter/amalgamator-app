import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const authLinks = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button 
        color="inherit" 
        component={RouterLink} 
        to="/dashboard"
        sx={{ mr: 2 }}
      >
        Dashboard
      </Button>
      <Button 
        color="inherit" 
        component={RouterLink} 
        to="/explorer"
        sx={{ mr: 2 }}
      >
        Explorer
      </Button>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );

  const guestLinks = (
    <Box>
      <Button 
        color="inherit" 
        component={RouterLink} 
        to="/login"
        sx={{ mr: 2 }}
      >
        Login
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        component={RouterLink} 
        to="/register"
      >
        Register
      </Button>
    </Box>
  );

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            Amalgamator
          </Typography>
          {isAuthenticated ? authLinks : guestLinks}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
