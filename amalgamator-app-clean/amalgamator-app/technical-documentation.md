# Amalgamator Technical Documentation

This document provides technical details about the architecture, implementation, and maintenance of the Amalgamator web application.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Data Models](#data-models)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Business Logic](#business-logic)
7. [Frontend Components](#frontend-components)
8. [State Management](#state-management)
9. [Testing Strategy](#testing-strategy)
10. [Deployment](#deployment)
11. [Maintenance](#maintenance)

## Architecture Overview

Amalgamator follows a modern web architecture with separated frontend and backend components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client-Side    │◄───►│  Server-Side    │◄───►│  Database       │
│  (Frontend)     │     │  (Backend)      │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

- **Client-Side**: React.js application handling UI rendering and user interactions
- **Server-Side**: Node.js/Express.js API handling business logic and data operations
- **Database**: MongoDB storing user data, amalgamations, and contributions

## Technology Stack

### Frontend
- **Framework**: React.js
- **State Management**: Redux with Redux Toolkit
- **UI Components**: Material-UI
- **Routing**: React Router
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library, Selenium

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest, Supertest

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx
- **CI/CD**: (Recommended: GitHub Actions)

## Data Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  educationLevel: String (optional),
  age: Number (optional),
  location: String (optional),
  socialMediaLink: String (required),
  contributionPoints: Number (default: 0),
  badges: [ObjectId] (references Badge model),
  settings: {
    notifications: Boolean,
    theme: String
  },
  lastAmalgamationTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Amalgamation Model
```javascript
{
  term1: {
    text: String (required),
    category: String,
    hierarchyPath: [String]
  },
  term2: {
    text: String (required),
    category: String,
    hierarchyPath: [String]
  },
  createdBy: ObjectId (references User model),
  status: String (enum: ['open', 'focused', 'closed']),
  mode: String (enum: ['focus', 'innovator', 'play']),
  totalVotes: Number,
  plausibleVotes: Number,
  notPlausibleVotes: Number,
  irrelevantVotes: Number,
  aiPerspective: {
    evaluation: String,
    confidence: Number,
    explanation: String
  },
  highVolume: Boolean,
  contributors: [ObjectId] (references User model),
  contributions: [ObjectId] (references Contribution model),
  createdAt: Date,
  updatedAt: Date
}
```

### Contribution Model
```javascript
{
  amalgamationId: ObjectId (references Amalgamation model),
  userId: ObjectId (references User model),
  text: String (required, max 255 chars),
  evaluation: String (enum: ['plausible', 'notPlausible', 'irrelevant']),
  likes: Number,
  likedBy: [ObjectId] (references User model),
  isRemoved: Boolean,
  isEdited: Boolean,
  editHistory: [{
    timestamp: Date,
    previousText: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Badge Model
```javascript
{
  name: String (required, unique),
  description: String (required),
  icon: String (required),
  criteria: String (required),
  category: String (enum: ['pioneer', 'veteran', 'contributor']),
  createdAt: Date,
  updatedAt: Date
}
```

### HierarchicalData Model
```javascript
{
  source: String (enum: ['roget', 'dewey']),
  level1: String (required),
  level2: String,
  level3: String,
  level4: String,
  terms: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get token
- `GET /api/auth/user` - Get current user data

### Amalgamation Endpoints
- `POST /api/amalgamations` - Create a new amalgamation
- `GET /api/amalgamations` - Get all amalgamations
- `GET /api/amalgamations/:id` - Get amalgamation by ID
- `GET /api/amalgamations/random` - Get a random amalgamation
- `PUT /api/amalgamations/:id` - Update an amalgamation

### Contribution Endpoints
- `POST /api/contributions` - Create a new contribution
- `GET /api/contributions/amalgamation/:amalgamationId` - Get all contributions for an amalgamation
- `PUT /api/contributions/:id` - Update a contribution
- `DELETE /api/contributions/:id` - Delete a contribution
- `POST /api/contributions/:id/like` - Like a contribution

### Badge Endpoints
- `GET /api/badges` - Get all badges
- `GET /api/badges/user/:userId` - Get all badges for a user
- `POST /api/badges` - Create a new badge (admin only)
- `POST /api/badges/award/:badgeId/:userId` - Award a badge to a user (admin only)

### Data Endpoints
- `GET /api/data/hierarchical` - Get all hierarchical data
- `GET /api/data/hierarchical/:source` - Get hierarchical data by source
- `POST /api/data/import/roget` - Import Roget's Thesaurus data
- `GET /api/data/search/:term` - Search for a term in hierarchical data

## Authentication

Amalgamator uses JWT (JSON Web Tokens) for authentication:

1. **Token Generation**: When a user registers or logs in, the server generates a JWT containing the user's ID
2. **Token Storage**: The token is stored in localStorage on the client side
3. **Request Authentication**: The token is included in the `x-auth-token` header for authenticated requests
4. **Token Verification**: The server verifies the token for protected routes
5. **Middleware**: The `auth.js` middleware handles token verification

```javascript
// Example of auth middleware
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
```

## Business Logic

### Timer and Contribution Points System

The core business logic includes:

1. **Hourly Timer**: Users can only create one new amalgamation per hour
   ```javascript
   // Check if user can create a new amalgamation (time restriction)
   const lastAmalgamationTime = new Date(user.lastAmalgamationTime);
   const currentTime = new Date();
   const hoursSinceLastAmalgamation = (currentTime - lastAmalgamationTime) / (1000 * 60 * 60);
   
   if (hoursSinceLastAmalgamation < 1 && user.contributionPoints < 1) {
     return res.status(400).json({ 
       msg: 'You can only create one amalgamation per hour. Please wait or use a contribution point.' 
     });
   }
   ```

2. **Contribution Points**: Users earn 1 point for every 10 contributions
   ```javascript
   // Update user's contribution points (10 contributions = 1 point)
   const userContributions = await Contribution.countDocuments({ userId: req.user.id });
   
   if (userContributions % 10 === 0) {
     user.contributionPoints += 1;
     await user.save();
   }
   ```

3. **Point Usage**: Points can be used to bypass the timer
   ```javascript
   // If user is using a contribution point, deduct it
   if (hoursSinceLastAmalgamation < 1 && user.contributionPoints >= 1) {
     user.contributionPoints -= 1;
   }
   ```

### Amalgamation States

Amalgamations can be in one of three states:
- **Open**: Available for all contributors
- **Focused**: Available only for existing contributors
- **Closed**: No longer accepting contributions

## Frontend Components

### Core Components

1. **Layout Components**:
   - `Navbar.js`: Main navigation bar
   - `Footer.js`: Application footer

2. **Page Components**:
   - `Home.js`: Landing page
   - `Login.js`: User login
   - `Register.js`: User registration
   - `Dashboard.js`: User dashboard
   - `AmalgamationExplorer.js`: Interface for creating amalgamations
   - `AmalgamationDetail.js`: Interface for viewing and contributing to amalgamations
   - `Profile.js`: User profile page
   - `NotFound.js`: 404 page

3. **Routing Components**:
   - `PrivateRoute.js`: Route protection for authenticated users

### Component Hierarchy

```
App
├── Navbar
├── Routes
│   ├── Home
│   ├── Login
│   ├── Register
│   ├── PrivateRoute
│   │   ├── Dashboard
│   │   ├── AmalgamationExplorer
│   │   ├── AmalgamationDetail
│   │   └── Profile
│   └── NotFound
└── Footer
```

## State Management

Amalgamator uses Redux for state management:

### Store Configuration
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import amalgamationReducer from './slices/amalgamationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    amalgamation: amalgamationReducer
  }
});

export default store;
```

### Auth Slice
Manages authentication state including user login, registration, and profile data.

### Amalgamation Slice
Manages amalgamation state including creation, retrieval, and contribution.

## Testing Strategy

Amalgamator implements a comprehensive testing strategy:

### Backend Tests
- **API Tests**: Test all endpoints using Supertest
- **Model Tests**: Validate data models and relationships
- **Authentication Tests**: Verify JWT authentication
- **Business Logic Tests**: Test timer and points system

### Frontend Tests
- **Component Tests**: Test rendering and user interactions
- **Redux Tests**: Verify state management
- **Form Tests**: Validate form submissions and validation

### End-to-End Tests
- **User Flows**: Test complete user journeys
- **Integration**: Verify frontend and backend integration

## Deployment

Amalgamator supports multiple deployment options:

### Docker Deployment
- Uses Docker Compose for multi-container setup
- Separate containers for frontend, backend, and database
- Nginx for serving frontend and proxying API requests

### Traditional Deployment
- Build frontend with `npm run build`
- Serve backend with Node.js
- Configure MongoDB separately

### Cloud Deployment
- Can be deployed to various cloud platforms
- Heroku deployment instructions provided
- MongoDB Atlas recommended for database

## Maintenance

### Regular Maintenance Tasks
1. **Dependency Updates**: Regularly update npm packages
2. **Database Backups**: Schedule regular MongoDB backups
3. **Performance Monitoring**: Monitor API response times
4. **Error Logging**: Implement error tracking
5. **Security Updates**: Apply security patches promptly

### Scaling Considerations
1. **Database Indexing**: Implement proper indexes for performance
2. **Load Balancing**: Add load balancing for high traffic
3. **Caching**: Implement Redis caching for frequent queries
4. **CDN**: Use CDN for static assets
5. **Horizontal Scaling**: Add more backend instances as needed
