const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  criteria: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['pioneer', 'veteran', 'contributor'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', BadgeSchema);
