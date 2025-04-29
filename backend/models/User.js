const mongoose = require('mongoose');
const bcrypt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  educationLevel: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  socialMediaLink: {
    type: String,
    required: true
  },
  contributionPoints: {
    type: Number,
    default: 0
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  lastAmalgamationTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
