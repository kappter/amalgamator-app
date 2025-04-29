import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  Paper
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import CreateIcon from '@mui/icons-material/Create';
import CasinoIcon from '@mui/icons-material/Casino';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(to right, #2c3e50, #4CA1AF)',
        color: 'white',
        borderRadius: 2,
        mb: 6
      }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Amalgamator
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Explore connections between seemingly unrelated concepts
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/register')}
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button 
            variant="outlined" 
            color="inherit" 
            size="large"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Box>
      </Box>

      {/* Mode Cards */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Explore Different Modes
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <ExploreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Focus Mode
              </Typography>
              <Typography variant="body1">
                Choose one mastery concept and explore its connections with other ideas.
                Perfect for deep diving into specific areas of interest.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <CreateIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Innovator Mode
              </Typography>
              <Typography variant="body1">
                With the goal of creating something new, explore unexpected connections
                between different concepts to spark innovation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <CasinoIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Play Mode
              </Typography>
              <Typography variant="body1">
                Random play with more exposure to new topics. Discover surprising
                connections and expand your knowledge horizons.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* How It Works */}
      <Paper sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          How It Works
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                1. Choose Your Mode
              </Typography>
              <Typography variant="body2">
                Select Focus, Innovator, or Play mode based on your goals.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                2. Explore Concepts
              </Typography>
              <Typography variant="body2">
                Discover connections between different concepts and ideas.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                3. Vote & Contribute
              </Typography>
              <Typography variant="body2">
                Evaluate connections as plausible, not plausible, or irrelevant.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                4. Gain Insights
              </Typography>
              <Typography variant="body2">
                See how your evaluations compare with others and AI perspectives.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to explore connections?
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={() => navigate('/register')}
          sx={{ mt: 2 }}
        >
          Join Amalgamator Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
