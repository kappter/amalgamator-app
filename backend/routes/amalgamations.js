const express = require('express');
const router = express.Router();
const Amalgamation = require('../models/Amalgamation');
const User = require('../models/User');
const Contribution = require('../models/Contribution');

// @route   POST api/amalgamations
// @desc    Create a new amalgamation
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { term1, term2, mode } = req.body;
    
    // Check if user can create a new amalgamation (time restriction)
    const user = await User.findById(req.user.id);
    const lastAmalgamationTime = new Date(user.lastAmalgamationTime);
    const currentTime = new Date();
    const hoursSinceLastAmalgamation = (currentTime - lastAmalgamationTime) / (1000 * 60 * 60);
    
    // If less than 1 hour has passed and user has no contribution points, return error
    if (hoursSinceLastAmalgamation < 1 && user.contributionPoints < 1) {
      return res.status(400).json({ 
        msg: 'You can only create one amalgamation per hour. Please wait or use a contribution point.' 
      });
    }
    
    // If user is using a contribution point, deduct it
    if (hoursSinceLastAmalgamation < 1 && user.contributionPoints >= 1) {
      user.contributionPoints -= 1;
    }
    
    // Update user's last amalgamation time
    user.lastAmalgamationTime = currentTime;
    await user.save();
    
    // Create new amalgamation
    const newAmalgamation = new Amalgamation({
      term1,
      term2,
      mode: mode || 'play', // Default to play mode if not specified
      createdBy: req.user.id,
      contributors: [req.user.id]
    });
    
    const amalgamation = await newAmalgamation.save();
    res.json(amalgamation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/amalgamations
// @desc    Get all amalgamations
// @access  Private
router.get('/', async (req, res) => {
  try {
    const amalgamations = await Amalgamation.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username')
      .populate('contributors', 'username');
    res.json(amalgamations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/amalgamations/:id
// @desc    Get amalgamation by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const amalgamation = await Amalgamation.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('contributors', 'username')
      .populate({
        path: 'contributions',
        populate: {
          path: 'userId',
          select: 'username'
        }
      });
    
    if (!amalgamation) {
      return res.status(404).json({ msg: 'Amalgamation not found' });
    }
    
    res.json(amalgamation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Amalgamation not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/amalgamations/random
// @desc    Get a random amalgamation
// @access  Private
router.get('/random', async (req, res) => {
  try {
    const count = await Amalgamation.countDocuments();
    const random = Math.floor(Math.random() * count);
    const amalgamation = await Amalgamation.findOne().skip(random)
      .populate('createdBy', 'username')
      .populate('contributors', 'username');
    
    res.json(amalgamation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/amalgamations/:id
// @desc    Update an amalgamation
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Find the amalgamation
    let amalgamation = await Amalgamation.findById(req.params.id);
    
    if (!amalgamation) {
      return res.status(404).json({ msg: 'Amalgamation not found' });
    }
    
    // Check if user is the creator
    if (amalgamation.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update fields
    if (status) amalgamation.status = status;
    
    await amalgamation.save();
    res.json(amalgamation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Amalgamation not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
