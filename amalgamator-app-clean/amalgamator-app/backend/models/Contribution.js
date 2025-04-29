const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  amalgamationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amalgamation',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 255
  },
  evaluation: {
    type: String,
    enum: ['plausible', 'notPlausible', 'irrelevant'],
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isRemoved: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    previousText: {
      type: String
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Contribution', ContributionSchema);
