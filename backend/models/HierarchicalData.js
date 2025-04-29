const mongoose = require('mongoose');

const HierarchicalDataSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['roget', 'dewey'],
    required: true
  },
  level1: {
    type: String,
    required: true
  },
  level2: {
    type: String,
    required: false
  },
  level3: {
    type: String,
    required: false
  },
  level4: {
    type: String,
    required: false
  },
  terms: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('HierarchicalData', HierarchicalDataSchema);
