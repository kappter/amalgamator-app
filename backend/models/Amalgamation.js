const mongoose = require('mongoose');

const AmalgamationSchema = new mongoose.Schema({
  term1: {
    text: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: false
    },
    hierarchyPath: [{
      type: String
    }]
  },
  term2: {
    text: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: false
    },
    hierarchyPath: [{
      type: String
    }]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'focused', 'closed'],
    default: 'open'
  },
  mode: {
    type: String,
    enum: ['focus', 'innovator', 'play'],
    default: 'play'
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  plausibleVotes: {
    type: Number,
    default: 0
  },
  notPlausibleVotes: {
    type: Number,
    default: 0
  },
  irrelevantVotes: {
    type: Number,
    default: 0
  },
  aiPerspective: {
    evaluation: {
      type: String,
      enum: ['plausible', 'notPlausible', 'irrelevant'],
      required: false
    },
    confidence: {
      type: Number,
      required: false
    },
    explanation: {
      type: String,
      required: false
    }
  },
  highVolume: {
    type: Boolean,
    default: false
  },
  contributors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  contributions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contribution'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Amalgamation', AmalgamationSchema);
