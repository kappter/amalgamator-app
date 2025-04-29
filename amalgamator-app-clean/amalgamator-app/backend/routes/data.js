const express = require('express');
const router = express.Router();
const HierarchicalData = require('../models/HierarchicalData');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// @route   GET api/data/hierarchical
// @desc    Get all hierarchical data
// @access  Private
router.get('/hierarchical', async (req, res) => {
  try {
    const data = await HierarchicalData.find().sort({ source: 1, level1: 1 });
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/data/hierarchical/:source
// @desc    Get hierarchical data by source (roget or dewey)
// @access  Private
router.get('/hierarchical/:source', async (req, res) => {
  try {
    const data = await HierarchicalData.find({ source: req.params.source })
      .sort({ level1: 1 });
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/data/import/roget
// @desc    Import Roget's Thesaurus data from CSV
// @access  Private/Admin
router.post('/import/roget', async (req, res) => {
  try {
    // Check if data already exists
    const existingData = await HierarchicalData.findOne({ source: 'roget' });
    if (existingData) {
      return res.status(400).json({ msg: 'Roget data already imported' });
    }
    
    const results = [];
    const csvFilePath = path.join(__dirname, '../../data/roget.csv');
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Process and save data
        const hierarchicalData = results.map(row => ({
          source: 'roget',
          level1: row.C1 || '',
          level2: row.C2 || '',
          level3: row.C3 || '',
          level4: row.C4 || '',
          terms: row.terms ? row.terms.split(',').map(term => term.trim()) : []
        }));
        
        await HierarchicalData.insertMany(hierarchicalData);
        res.json({ msg: 'Roget data imported successfully', count: hierarchicalData.length });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/data/search/:term
// @desc    Search for a term in hierarchical data
// @access  Private
router.get('/search/:term', async (req, res) => {
  try {
    const term = req.params.term.toLowerCase();
    const data = await HierarchicalData.find({
      terms: { $elemMatch: { $regex: term, $options: 'i' } }
    });
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
