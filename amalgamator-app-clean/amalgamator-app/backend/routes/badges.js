const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const User = require('../models/User');

// @route   GET api/badges
// @desc    Get all badges
// @access  Private
router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find().sort({ category: 1, name: 1 });
    res.json(badges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/badges/user/:userId
// @desc    Get all badges for a user
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('badges');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user.badges);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/badges
// @desc    Create a new badge (admin only)
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const { name, description, icon, criteria, category } = req.body;
    
    // Check if badge already exists
    let badge = await Badge.findOne({ name });
    if (badge) {
      return res.status(400).json({ msg: 'Badge already exists' });
    }
    
    // Create new badge
    badge = new Badge({
      name,
      description,
      icon,
      criteria,
      category
    });
    
    await badge.save();
    res.json(badge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/badges/award/:badgeId/:userId
// @desc    Award a badge to a user (admin only)
// @access  Private/Admin
router.post('/award/:badgeId/:userId', async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.badgeId);
    if (!badge) {
      return res.status(404).json({ msg: 'Badge not found' });
    }
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if user already has this badge
    if (user.badges.includes(req.params.badgeId)) {
      return res.status(400).json({ msg: 'User already has this badge' });
    }
    
    // Award badge to user
    user.badges.push(req.params.badgeId);
    await user.save();
    
    res.json({ msg: 'Badge awarded successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invalid badge or user ID' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
