import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Divider
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const AmalgamationDetail = () => {
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Mock data - would come from API in production
  const amalgamation = {
    term1: {
      text: 'Guitar',
      category: 'Music Instruments'
    },
    term2: {
      text: 'Snowboard',
      category: 'Winter Sports'
    },
    plausibleVotes: 180,
    notPlausibleVotes: 20,
    irrelevantVotes: 30,
    totalVotes: 230,
    contributions: [
      {
        id: 1,
        text: 'Both require balance and body coordination to master',
        evaluation: 'plausible',
        username: 'user123',
        likes: 12
      },
      {
        id: 2,
        text: 'Both have a learning curve that starts with basics and progresses to advanced techniques',
        evaluation: 'plausible',
        username: 'musiclover',
        likes: 8
      },
      {
        id: 3,
        text: 'Both can be used for self-expression and creativity',
        evaluation: 'plausible',
        username: 'snowrider',
        likes: 5
      }
    ]
  };

  const handleEvaluationChange = (event) => {
    setEvaluation(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    // In a real implementation, this would dispatch an action to submit the contribution
    setSubmitted(true);
  };

  const renderVotingSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        What do you think?
      </Typography>
      <Typography variant="body1" paragraph>
        Is there a meaningful connection between {amalgamation.term1.text} and {amalgamation.term2.text}?
      </Typography>
      
      <RadioGroup
        value={evaluation}
        onChange={handleEvaluationChange}
        sx={{ mb: 3 }}
      >
        <FormControlLabel 
          value="plausible" 
          control={<Radio />} 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbUpIcon color="success" sx={{ mr: 1 }} />
              <Typography>Plausible - I see a connection</Typography>
            </Box>
          } 
        />
        <FormControlLabel 
          value="notPlausible" 
          control={<Radio />} 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThumbDownIcon color="error" sx={{ mr: 1 }} />
              <Typography>Not Plausible - I don't see a connection</Typography>
            </Box>
          } 
        />
        <FormControlLabel 
          value="irrelevant" 
          control={<Radio />} 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HelpOutlineIcon color="disabled" sx={{ mr: 1 }} />
              <Typography>Irrelevant - These concepts don't relate</Typography>
            </Box>
          } 
        />
      </RadioGroup>
      
      <TextField
        label="Your thoughts (max 255 characters)"
        multiline
        rows={3}
        value={comment}
        onChange={handleCommentChange}
        fullWidth
        variant="outlined"
        inputProps={{ maxLength: 255 }}
        sx={{ mb: 2 }}
      />
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
        {comment.length}/255 characters
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
        disabled={!evaluation || !comment || submitted}
      >
        Submit
      </Button>
    </Box>
  );

  const renderResults = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Community Results
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card sx={{ textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="h6">Plausible</Typography>
              <Typography variant="h4" color="success.main">
                {Math.round((amalgamation.plausibleVotes / amalgamation.totalVotes) * 100)}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {amalgamation.plausibleVotes} votes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ textAlign: 'center', bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography variant="h6">Not Plausible</Typography>
              <Typography variant="h4" color="error.main">
                {Math.round((amalgamation.notPlausibleVotes / amalgamation.totalVotes) * 100)}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {amalgamation.notPlausibleVotes} votes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ textAlign: 'center', bgcolor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6">Irrelevant</Typography>
              <Typography variant="h4" color="text.secondary">
                {Math.round((amalgamation.irrelevantVotes / amalgamation.totalVotes) * 100)}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {amalgamation.irrelevantVotes} votes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h6" gutterBottom>
        AI Perspective
      </Typography>
      <Card sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            There are several meaningful connections between guitars and snowboards:
          </Typography>
          <Typography variant="body2" component="ul">
            <li>Both require physical skill and practice to master</li>
            <li>Both are used in recreational activities and can be enjoyed at various skill levels</li>
            <li>Both have evolved over time with technological improvements in materials and design</li>
            <li>Both have distinct cultures and communities built around them</li>
          </Typography>
        </CardContent>
      </Card>
      
      <Typography variant="h6" gutterBottom>
        Community Contributions
      </Typography>
      {amalgamation.contributions.map(contribution => (
        <Card key={contribution.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary">
                {contribution.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ThumbUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2">{contribution.likes}</Typography>
              </Box>
            </Box>
            <Typography variant="body1">
              {contribution.text}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Exploring Connection
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Card sx={{ minWidth: 200, textAlign: 'center', mr: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                {amalgamation.term1.text}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {amalgamation.term1.category}
              </Typography>
            </CardContent>
          </Card>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
            ⟷
          </Typography>
          <Card sx={{ minWidth: 200, textAlign: 'center', ml: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                {amalgamation.term2.text}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {amalgamation.term2.category}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        {!submitted ? renderVotingSection() : (
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Thank you for your contribution!
            </Typography>
            <Typography variant="body1" paragraph>
              Your evaluation has been recorded. Now you can see how others have evaluated this connection.
            </Typography>
            <Divider sx={{ my: 3 }} />
          </Box>
        )}
        
        {submitted && renderResults()}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/explorer')}
          >
            Back to Explorer
          </Button>
          {submitted && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/explorer')}
            >
              Explore Another Connection
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AmalgamationDetail;
