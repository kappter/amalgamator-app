import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimelineIcon from '@mui/icons-material/Timeline';
import HistoryIcon from '@mui/icons-material/History';

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // Mock user data - would come from API in production
  const userData = {
    username: 'conceptexplorer',
    email: 'explorer@example.com',
    contributionPoints: 5,
    totalContributions: 47,
    joinDate: '2025-01-15T00:00:00Z',
    location: 'San Francisco, CA',
    educationLevel: 'Master\'s Degree',
    badges: [
      {
        id: '1',
        name: 'Pioneer',
        description: 'One of the first 100 users to join Amalgamator',
        icon: '🏆',
        category: 'pioneer'
      },
      {
        id: '2',
        name: 'Contributor',
        description: 'Made over 25 contributions',
        icon: '🌟',
        category: 'contributor'
      },
      {
        id: '3',
        name: 'Connector',
        description: 'Created 10 plausible connections',
        icon: '🔗',
        category: 'contributor'
      }
    ],
    recentContributions: [
      {
        id: '1',
        amalgamationId: '1',
        terms: 'Guitar ⟷ Snowboard',
        text: 'Both require balance and body coordination to master',
        evaluation: 'plausible',
        date: '2025-03-30T14:00:00Z',
        likes: 12
      },
      {
        id: '2',
        amalgamationId: '2',
        terms: 'Quantum Physics ⟷ Poetry',
        text: 'Both attempt to describe reality beyond conventional language',
        evaluation: 'plausible',
        date: '2025-03-29T10:30:00Z',
        likes: 8
      },
      {
        id: '3',
        amalgamationId: '3',
        terms: 'Basketball ⟷ Chess',
        text: 'Both require strategic thinking and anticipating opponent moves',
        evaluation: 'plausible',
        date: '2025-03-28T16:15:00Z',
        likes: 15
      }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
          Profile
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* User Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  mb: 2
                }}
              >
                {userData.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5">{userData.username}</Typography>
              <Typography variant="body2" color="textSecondary">
                Member since {formatDate(userData.joinDate)}
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Location" 
                  secondary={userData.location || 'Not specified'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Education" 
                  secondary={userData.educationLevel || 'Not specified'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Contribution Points" 
                  secondary={userData.contributionPoints} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmojiEventsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Badges Earned" 
                  secondary={userData.badges.length} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Total Contributions" 
                  secondary={userData.totalContributions} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Tabs Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ mb: 3 }}
            >
              <Tab label="Badges" />
              <Tab label="Recent Contributions" />
            </Tabs>
            
            {/* Badges Tab */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Badges
                </Typography>
                <Grid container spacing={3}>
                  {userData.badges.map(badge => (
                    <Grid item xs={12} sm={6} md={4} key={badge.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h3" sx={{ mb: 1 }}>
                              {badge.icon}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                              {badge.name}
                            </Typography>
                            <Chip 
                              label={badge.category.charAt(0).toUpperCase() + badge.category.slice(1)} 
                              size="small"
                              color={
                                badge.category === 'pioneer' ? 'primary' : 
                                badge.category === 'contributor' ? 'success' : 
                                'default'
                              }
                              sx={{ mb: 2 }}
                            />
                            <Typography variant="body2" align="center">
                              {badge.description}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {userData.badges.length === 0 && (
                  <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                    You haven't earned any badges yet. Keep contributing to earn badges!
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Recent Contributions Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Recent Contributions
                </Typography>
                <Grid container spacing={3}>
                  {userData.recentContributions.map(contribution => (
                    <Grid item xs={12} key={contribution.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {contribution.terms}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {formatDate(contribution.date)}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            "{contribution.text}"
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              label={contribution.evaluation.charAt(0).toUpperCase() + contribution.evaluation.slice(1)} 
                              color={
                                contribution.evaluation === 'plausible' ? 'success' : 
                                contribution.evaluation === 'notPlausible' ? 'error' : 
                                'default'
                              }
                              size="small"
                              sx={{ mr: 2 }}
                            />
                            <Typography variant="body2" color="textSecondary">
                              {contribution.likes} likes
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {userData.recentContributions.length === 0 && (
                  <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                    You haven't made any contributions yet.
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
