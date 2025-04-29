# Amalgamator Web Application

This repository contains the Amalgamator web application, a platform for exploring connections between seemingly unrelated concepts.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Deployment](#deployment)
- [Testing](#testing)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Overview

Amalgamator is a web application designed to explore connections between seemingly unrelated concepts. It allows users to input terms and examine their relationships through both human and AI perspectives. The application incorporates gamification elements and educational layers to enhance the user experience.

## Features

- **Three Exploration Modes**:
  - **Focus Mode**: Choose one mastery concept and explore its connections with other ideas
  - **Innovator Mode**: Goal of creating something new by exploring unexpected connections
  - **Play Mode**: Random play with more exposure to new topics

- **User Contribution System**:
  - Evaluate connections as plausible, not plausible, or irrelevant
  - Add comments and explanations (max 255 characters)
  - Vote on other users' contributions

- **Gamification Elements**:
  - Contribution points system (10 contributions = 1 point)
  - Badges for achievements
  - Timer system (one new amalgamation per hour)

- **Educational Layer**:
  - AI perspective on connections
  - Hierarchical data from Roget's Thesaurus
  - Community insights and explanations

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/amalgamator.git
   cd amalgamator
   ```

2. Install dependencies
   ```bash
   npm run install:all
   ```

3. Set up environment variables
   Create a `.env` file in the backend directory:
   ```
   MONGO_URI=mongodb://localhost:27017/amalgamator
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the development servers
   ```bash
   npm start
   ```

5. Access the application
   Open your browser and navigate to `http://localhost:3000`

## Usage

### Registration and Login

1. Create an account with your email, username, and password
2. Additional profile information (education level, age, location) is optional
3. A social media link is required for verification purposes

### Exploring Connections

1. From the dashboard, click "Create New Amalgamation" or "Explore More"
2. Choose your preferred mode (Focus, Innovator, or Play)
3. Follow the prompts to select concepts for exploration
4. Evaluate the connection between concepts
5. Add your thoughts on why the connection is plausible or not
6. View community results and AI perspective

### Managing Your Profile

1. Access your profile from the navigation menu
2. View your contribution history and badges
3. Check your contribution points balance
4. Update your profile information

## Deployment

For detailed deployment instructions, please refer to the [Deployment Guide](deployment-guide.md).

## Testing

The application includes comprehensive test suites:

- **Backend Tests**: `cd backend && npm test`
- **Frontend Tests**: `cd frontend && npm test`
- **End-to-End Tests**: `cd frontend && npm run test:e2e`
- **All Tests**: `npm test`

## Architecture

Amalgamator follows a modern web architecture:

- **Frontend**: React.js with Redux and Material-UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based authentication

For more details, see the architecture documentation.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
