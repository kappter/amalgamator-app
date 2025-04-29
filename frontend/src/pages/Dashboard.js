import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimelineIcon from '@mui/icons-material/Timeline';
import PersonIcon from '@mui/icons-material/Person';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [recentAmalgamations, setRecentAmalgamations] = useState([]);
  const [userStats, setUserStats] = useState({
    contributionPoints: 5,
    totalContributions: 47,
    badgesEarned: 3
  });
  
  // Mock data - would come from API in production
  useEffect(() => {
    // Simulate API call
    setRecentAmalgamations([
      {
        id: '1',
        term1: { text: 'Guitar' },
        term2: { text: 'Snowboard' },
        createdAt: '2025-03-30T14:00:00Z',
        totalVotes: 230,
        plausibleVotes: 180
      },
      {
        id: '2',
        term1: { text: 'Quantum Physics' },
        term2: { text: 'Poetry' },
        createdAt: '2025-03-29T10:30:00Z',
        totalVotes: 156,
        plausibleVotes: 42
      },
      {
        id: '3',
        term1: { text: 'Basketball' },
        term2: { text: 'Chess' },
        createdAt: '2025-03-28T16:15:00Z',
        totalVotes: 312,
        plausibleVotes: 289
      }
    ]);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome back! Here's your Amalgamator activity overview.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* User Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Typography variant="h5">Your Profile</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Contribution Points" 
                  secondary={userStats.contributionPoints} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ExploreIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Total Contributions" 
                  secondary={userStats.totalContributions} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmojiEventsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Badges Earned" 
                  secondary={userStats.badgesEarned} 
                />
              </ListItem>
            </List>
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                href="/profile"
              >
                View Full Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Recent Amalgamations
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {recentAmalgamations.length > 0 ? (
              <Grid container spacing={3}>
                {recentAmalgamations.map(amalgamation => (
                  <Grid item xs={12} key={amalgamation.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6">
                            {amalgamation.term1.text} ⟷ {amalgamation.term2.text}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(amalgamation.createdAt)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Chip 
                            label={`${Math.round((amalgamation.plausibleVotes / amalgamation.totalVotes) * 100)}% Plausible`} 
                            color={amalgamation.plausibleVotes > amalgamation.totalVotes / 2 ? "success" : "default"}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {amalgamation.totalVotes} total votes
                          </Typography>
                        </Box>
                        <Button 
                          variant="outlined" 
                          size="small"
                          href={`/amalgamation/${amalgamation.id}`}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                No recent amalgamations found.
              </Typography>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="text" color="primary" href="/explorer">
                Explore More
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                href="/explorer"
              >
                Create New Amalgamation
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Timer Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Amalgamation Timer
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1">
                  You can access a new amalgamation in:
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                  00:24:15
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Or use 1 contribution point to access immediately
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="secondary"
                disabled={userStats.contributionPoints < 1}
              >
                Use Contribution Point
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
