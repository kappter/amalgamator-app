import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import CreateIcon from '@mui/icons-material/Create';
import CasinoIcon from '@mui/icons-material/Casino';

const AmalgamationExplorer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mode, setMode] = useState('play');
  const [step, setStep] = useState(0);
  const [focusTerm, setFocusTerm] = useState('');
  const [term1, setTerm1] = useState('');
  const [term2, setTerm2] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Sample terms for autocomplete (would come from API in production)
  const sampleTerms = [
    'Music', 'Sports', 'Guitar', 'Winter', 'Snowboard', 'Quantum Physics',
    'Artificial Intelligence', 'Philosophy', 'Art', 'Mathematics', 'Biology',
    'Chemistry', 'Psychology', 'Sociology', 'Economics', 'Politics'
  ];

  const handleModeChange = (event, newMode) => {
    setMode(newMode);
    setStep(0);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    setLoading(true);
    // In a real implementation, this would dispatch an action to create an amalgamation
    setTimeout(() => {
      setLoading(false);
      navigate('/amalgamation/new');
    }, 1500);
  };

  const renderModeSelection = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Choose Your Mode
      </Typography>
      <Tabs
        value={mode}
        onChange={handleModeChange}
        centered
        sx={{ mb: 4 }}
      >
        <Tab 
          value="focus" 
          label="Focus" 
          icon={<ExploreIcon />} 
          iconPosition="start" 
        />
        <Tab 
          value="innovator" 
          label="Innovator" 
          icon={<CreateIcon />} 
          iconPosition="start" 
        />
        <Tab 
          value="play" 
          label="Play" 
          icon={<CasinoIcon />} 
          iconPosition="start" 
        />
      </Tabs>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {mode === 'focus' && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Focus Mode
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Choose one mastery concept and explore its connections with other ideas.
                    Perfect for deep diving into specific areas of interest.
                  </Typography>
                </>
              )}
              {mode === 'innovator' && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Innovator Mode
                  </Typography>
                  <Typography variant="body1" paragraph>
                    With the goal of creating something new, explore unexpected connections
                    between different concepts to spark innovation.
                  </Typography>
                </>
              )}
              {mode === 'play' && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Play Mode
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Random play with more exposure to new topics. Discover surprising
                    connections and expand your knowledge horizons.
                  </Typography>
                </>
              )}
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
                fullWidth
              >
                Continue with {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderFocusSelection = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Choose Your Focus
      </Typography>
      <Typography variant="body1" paragraph>
        Select a concept you want to explore connections with.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Autocomplete
                options={sampleTerms}
                value={focusTerm}
                onChange={(event, newValue) => setFocusTerm(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Select a concept" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mb: 3 }}
                  />
                )}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleNext}
                  disabled={!focusTerm}
                >
                  Continue
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTermSelection = () => (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {mode === 'focus' 
          ? `Explore Connections with ${focusTerm}` 
          : 'Create an Amalgamation'
        }
      </Typography>
      <Typography variant="body1" paragraph>
        {mode === 'focus' 
          ? 'Select another concept to explore its connection with your focus concept.'
          : 'Select two concepts to explore their connection.'
        }
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {mode === 'focus' ? (
                <Autocomplete
                  options={sampleTerms.filter(term => term !== focusTerm)}
                  value={term1}
                  onChange={(event, newValue) => setTerm1(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Select a concept to connect with" 
                      variant="outlined" 
                      fullWidth 
                      sx={{ mb: 3 }}
                    />
                  )}
                />
              ) : (
                <>
                  <Autocomplete
                    options={sampleTerms}
                    value={term1}
                    onChange={(event, newValue) => setTerm1(newValue)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="First concept" 
                        variant="outlined" 
                        fullWidth 
                        sx={{ mb: 3 }}
                      />
                    )}
                  />
                  <Autocomplete
                    options={sampleTerms.filter(term => term !== term1)}
                    value={term2}
                    onChange={(event, newValue) => setTerm2(newValue)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Second concept" 
                        variant="outlined" 
                        fullWidth 
                        sx={{ mb: 3 }}
                      />
                    )}
                  />
                </>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSubmit}
                  disabled={mode === 'focus' ? !term1 : (!term1 || !term2)}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Explore Connection'
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mb: 6 }}>
        {step === 0 && renderModeSelection()}
        {step === 1 && mode === 'focus' && renderFocusSelection()}
        {((step === 1 && mode !== 'focus') || (step === 2 && mode === 'focus')) && renderTermSelection()}
      </Paper>
    </Container>
  );
};

export default AmalgamationExplorer;
