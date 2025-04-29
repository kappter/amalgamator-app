const express = require('express');
const router = express.Router();
const Contribution = require('../models/Contribution');
const Amalgamation = require('../models/Amalgamation');
const User = require('../models/User');

// @route   POST api/contributions
// @desc    Create a new contribution
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { amalgamationId, text, evaluation } = req.body;
    
    // Check if amalgamation exists
    const amalgamation = await Amalgamation.findById(amalgamationId);
    if (!amalgamation) {
      return res.status(404).json({ msg: 'Amalgamation not found' });
    }
    
    // Create new contribution
    const newContribution = new Contribution({
      amalgamationId,
      userId: req.user.id,
      text,
      evaluation
    });
    
    const contribution = await newContribution.save();
    
    // Update amalgamation with new contribution
    amalgamation.contributions.push(contribution._id);
    
    // Add user to contributors if not already there
    if (!amalgamation.contributors.includes(req.user.id)) {
      amalgamation.contributors.push(req.user.id);
    }
    
    // Update vote counts
    amalgamation.totalVotes += 1;
    if (evaluation === 'plausible') {
      amalgamation.plausibleVotes += 1;
    } else if (evaluation === 'notPlausible') {
      amalgamation.notPlausibleVotes += 1;
    } else if (evaluation === 'irrelevant') {
      amalgamation.irrelevantVotes += 1;
    }
    
    await amalgamation.save();
    
    // Update user's contribution points (10 contributions = 1 point)
    const user = await User.findById(req.user.id);
    const userContributions = await Contribution.countDocuments({ userId: req.user.id });
    
    if (userContributions % 10 === 0) {
      user.contributionPoints += 1;
      await user.save();
    }
    
    res.json(contribution);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/contributions/amalgamation/:amalgamationId
// @desc    Get all contributions for an amalgamation
// @access  Private
router.get('/amalgamation/:amalgamationId', async (req, res) => {
  try {
    const contributions = await Contribution.find({ 
      amalgamationId: req.params.amalgamationId,
      isRemoved: false
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');
    
    res.json(contributions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/contributions/:id
// @desc    Update a contribution
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Find the contribution
    let contribution = await Contribution.findById(req.params.id);
    
    if (!contribution) {
      return res.status(404).json({ msg: 'Contribution not found' });
    }
    
    // Check if user is the creator
    if (contribution.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Add current text to edit history
    contribution.editHistory.push({
      timestamp: Date.now(),
      previousText: contribution.text
    });
    
    // Update text and mark as edited
    contribution.text = text;
    contribution.isEdited = true;
    
    await contribution.save();
    res.json(contribution);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contribution not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/contributions/:id
// @desc    Delete a contribution
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    
    if (!contribution) {
      return res.status(404).json({ msg: 'Contribution not found' });
    }
    
    // Check if user is the creator
    if (contribution.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Soft delete by marking as removed
    contribution.isRemoved = true;
    await contribution.save();
    
    // Update amalgamation vote counts
    const amalgamation = await Amalgamation.findById(contribution.amalgamationId);
    amalgamation.totalVotes -= 1;
    
    if (contribution.evaluation === 'plausible') {
      amalgamation.plausibleVotes -= 1;
    } else if (contribution.evaluation === 'notPlausible') {
      amalgamation.notPlausibleVotes -= 1;
    } else if (contribution.evaluation === 'irrelevant') {
      amalgamation.irrelevantVotes -= 1;
    }
    
    await amalgamation.save();
    
    // Update user's contribution points
    const user = await User.findById(req.user.id);
    user.contributionPoints = Math.max(0, user.contributionPoints - 0.1); // Deduct 0.1 points for removal
    await user.save();
    
    res.json({ msg: 'Contribution removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contribution not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/contributions/:id/like
// @desc    Like a contribution
// @access  Private
router.post('/:id/like', async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    
    if (!contribution) {
      return res.status(404).json({ msg: 'Contribution not found' });
    }
    
    // Check if the contribution has already been liked by this user
    if (contribution.likedBy.includes(req.user.id)) {
      // Unlike
      contribution.likes -= 1;
      contribution.likedBy = contribution.likedBy.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      // Like
      contribution.likes += 1;
      contribution.likedBy.push(req.user.id);
    }
    
    await contribution.save();
    res.json(contribution);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contribution not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
