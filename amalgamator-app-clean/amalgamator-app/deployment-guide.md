# Amalgamator Deployment Guide

This document outlines the steps to deploy the Amalgamator web application.

## Prerequisites

- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

## Deployment Options

### Option 1: Local Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/amalgamator.git
   cd amalgamator
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```
   MONGO_URI=mongodb://localhost:27017/amalgamator
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=production
   ```

4. **Build the frontend**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   npm run deploy
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

### Option 2: Cloud Deployment (Heroku)

1. **Create a Heroku account and install the Heroku CLI**
   Follow the instructions at https://devcenter.heroku.com/articles/heroku-cli

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create a new Heroku app**
   ```bash
   heroku create amalgamator-app
   ```

4. **Add MongoDB add-on**
   ```bash
   heroku addons:create mongodb:sandbox
   ```

5. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret_key
   heroku config:set NODE_ENV=production
   ```

6. **Deploy the application**
   ```bash
   git push heroku main
   ```

7. **Open the application**
   ```bash
   heroku open
   ```

### Option 3: Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t amalgamator .
   ```

2. **Run the Docker container**
   ```bash
   docker run -p 5000:5000 -e MONGO_URI=mongodb://mongo:27017/amalgamator -e JWT_SECRET=your_jwt_secret_key amalgamator
   ```

3. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## Production Considerations

### Security
- Use HTTPS in production
- Set strong JWT secrets
- Implement rate limiting
- Configure proper CORS settings

### Performance
- Enable MongoDB indexing
- Implement caching strategies
- Use a CDN for static assets
- Configure proper server scaling

### Monitoring
- Set up application monitoring
- Implement error logging
- Configure performance metrics
- Set up alerts for critical issues

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Verify MongoDB is running
   - Check connection string
   - Ensure network connectivity

2. **Build Failures**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

3. **API Errors**
   - Check server logs
   - Verify environment variables
   - Test API endpoints with Postman

4. **Frontend Not Loading**
   - Check browser console for errors
   - Verify build process completed successfully
   - Check for CORS issues

## Maintenance

- Regularly update dependencies
- Monitor for security vulnerabilities
- Perform regular database backups
- Schedule maintenance windows for updates
