// Update server.js to include the routes
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import middleware
const auth = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (using a placeholder URL for now)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/amalgamator';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/amalgamations', auth, require('./routes/amalgamations'));
app.use('/api/contributions', auth, require('./routes/contributions'));
app.use('/api/badges', auth, require('./routes/badges'));
app.use('/api/data', auth, require('./routes/data'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Amalgamator API is running' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
