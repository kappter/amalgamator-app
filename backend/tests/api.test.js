const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Amalgamation = require('../models/Amalgamation');
const Contribution = require('../models/Contribution');

// Test user data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  socialMediaLink: 'https://twitter.com/testuser'
};

let token;
let userId;
let amalgamationId;

// Connect to test database before running tests
beforeAll(async () => {
  const testDbUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/amalgamator_test';
  await mongoose.connect(testDbUri);
  
  // Clear test database
  await User.deleteMany({});
  await Amalgamation.deleteMany({});
  await Contribution.deleteMany({});
});

// Disconnect from test database after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  test('Should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
    
    // Get user ID for later tests
    const user = await User.findOne({ email: testUser.email });
    userId = user._id;
  });
  
  test('Should login existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
  
  test('Should get user profile', async () => {
    const res = await request(app)
      .get('/api/auth/user')
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', testUser.username);
    expect(res.body).toHaveProperty('email', testUser.email);
  });
});

describe('Amalgamation API', () => {
  test('Should create a new amalgamation', async () => {
    const amalgamationData = {
      term1: {
        text: 'Guitar',
        category: 'Music'
      },
      term2: {
        text: 'Snowboard',
        category: 'Sports'
      },
      mode: 'play'
    };
    
    const res = await request(app)
      .post('/api/amalgamations')
      .set('x-auth-token', token)
      .send(amalgamationData);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('term1.text', amalgamationData.term1.text);
    expect(res.body).toHaveProperty('term2.text', amalgamationData.term2.text);
    expect(res.body).toHaveProperty('mode', amalgamationData.mode);
    
    amalgamationId = res.body._id;
  });
  
  test('Should get all amalgamations', async () => {
    const res = await request(app)
      .get('/api/amalgamations')
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
  
  test('Should get amalgamation by ID', async () => {
    const res = await request(app)
      .get(`/api/amalgamations/${amalgamationId}`)
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', amalgamationId);
  });
  
  test('Should update amalgamation status', async () => {
    const res = await request(app)
      .put(`/api/amalgamations/${amalgamationId}`)
      .set('x-auth-token', token)
      .send({ status: 'focused' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'focused');
  });
});

describe('Contribution API', () => {
  test('Should create a new contribution', async () => {
    const contributionData = {
      amalgamationId,
      text: 'Both require balance and body coordination to master',
      evaluation: 'plausible'
    };
    
    const res = await request(app)
      .post('/api/contributions')
      .set('x-auth-token', token)
      .send(contributionData);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('text', contributionData.text);
    expect(res.body).toHaveProperty('evaluation', contributionData.evaluation);
  });
  
  test('Should get contributions for an amalgamation', async () => {
    const res = await request(app)
      .get(`/api/contributions/amalgamation/${amalgamationId}`)
      .set('x-auth-token', token);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('Timer and Contribution Points', () => {
  test('Should enforce timer restriction', async () => {
    // Try to create another amalgamation immediately
    const amalgamationData = {
      term1: {
        text: 'Quantum Physics',
        category: 'Science'
      },
      term2: {
        text: 'Poetry',
        category: 'Arts'
      },
      mode: 'focus'
    };
    
    const res = await request(app)
      .post('/api/amalgamations')
      .set('x-auth-token', token)
      .send(amalgamationData);
    
    // Should return 400 error because of timer restriction
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('msg');
    expect(res.body.msg).toContain('hour');
  });
  
  test('Should award contribution points', async () => {
    // Create 10 contributions to earn a point
    for (let i = 0; i < 9; i++) { // We already created one above
      await request(app)
        .post('/api/contributions')
        .set('x-auth-token', token)
        .send({
          amalgamationId,
          text: `Test contribution ${i}`,
          evaluation: 'plausible'
        });
    }
    
    // Check if user has earned a contribution point
    const user = await User.findById(userId);
    expect(user.contributionPoints).toBeGreaterThan(0);
  });
  
  test('Should allow using contribution points to bypass timer', async () => {
    // Try to create another amalgamation using a contribution point
    const amalgamationData = {
      term1: {
        text: 'Quantum Physics',
        category: 'Science'
      },
      term2: {
        text: 'Poetry',
        category: 'Arts'
      },
      mode: 'focus'
    };
    
    const res = await request(app)
      .post('/api/amalgamations')
      .set('x-auth-token', token)
      .send(amalgamationData);
    
    // Should succeed because user has contribution points
    expect(res.statusCode).toEqual(200);
    
    // Check if a contribution point was deducted
    const user = await User.findById(userId);
    expect(user.contributionPoints).toBe(0);
  });
});
