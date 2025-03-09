# Deployment Guide

This guide outlines the steps for deploying the Calorie Counter backend to a production environment.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or another MongoDB hosting solution
- A web server (e.g., Nginx, Apache) or cloud platform (e.g., Heroku, AWS, DigitalOcean)

## Production Deployment Steps

### 1. Environment Configuration

1. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file with your production settings:
   - Set `NODE_ENV=production`
   - Configure MongoDB URI with your production database
   - Set a strong, unique JWT secret key
   - Configure CORS to allow only your frontend domain
   - Adjust rate limiting parameters as needed

### 2. Building the Application

1. Install production dependencies:
   ```
   npm ci --only=production
   ```

2. Build the TypeScript code:
   ```
   npm run build
   ```

### 3. Database Setup

1. Ensure your MongoDB instance is properly secured:
   - Use strong authentication
   - Enable network restrictions (IP whitelisting)
   - Set up database user with appropriate permissions

2. Create indexes for better performance:
   ```javascript
   // Run these commands in MongoDB shell or use a migration script
   db.foodentries.createIndex({ user: 1, timestamp: -1 })
   db.users.createIndex({ email: 1 }, { unique: true })
   ```

### 4. Server Configuration

#### Option A: Standalone Node.js with PM2

1. Install PM2 globally:
   ```
   npm install -g pm2
   ```

2. Create a PM2 ecosystem file (ecosystem.config.js):
   ```javascript
   module.exports = {
     apps: [{
       name: "calorie-counter-api",
       script: "./dist/server.js",
       instances: "max",
       exec_mode: "cluster",
       env: {
         NODE_ENV: "production"
       }
     }]
   }
   ```

3. Start the application:
   ```
   pm2 start ecosystem.config.js
   ```

4. Set up PM2 to start on system boot:
   ```
   pm2 startup
   pm2 save
   ```

#### Option B: Using Docker

1. Create a Dockerfile:
   ```Dockerfile
   FROM node:16-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY dist ./dist
   
   EXPOSE 5005
   
   CMD ["node", "dist/server.js"]
   ```

2. Build and run the Docker image:
   ```
   docker build -t calorie-counter-api .
   docker run -d -p 5005:5005 --env-file .env --name calorie-counter-api calorie-counter-api
   ```

#### Option C: Cloud Deployment (e.g., Heroku)

1. Create a Procfile:
   ```
   web: node dist/server.js
   ```

2. Deploy to Heroku:
   ```
   heroku create
   git push heroku main
   ```

3. Set environment variables in Heroku:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=your_mongo_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   // Set other environment variables as needed
   ```

### 5. Security Checklist

- ✅ Enable rate limiting (already implemented)
- ✅ Use security headers with Helmet (already implemented)
- ✅ Implement HTTPS on your web server
- ✅ Configure appropriate CORS settings
- ✅ Keep dependencies updated regularly
- ✅ Set up monitoring and logging
- ✅ Configure database connection pooling
- ✅ Implement proper error handling (already implemented)

### 6. Monitoring and Maintenance

1. Set up monitoring with tools like:
   - PM2 built-in monitoring
   - New Relic
   - Datadog
   - Sentry for error tracking

2. Set up regular backups for your MongoDB database

3. Create a maintenance plan:
   - Regular security updates
   - Dependency updates
   - Performance optimization

## CI/CD Pipeline (Optional)

For automated deployment, consider setting up a CI/CD pipeline using:
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI

Example GitHub Actions workflow (.github/workflows/deploy.yml):
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      # Add your deployment steps here based on your hosting platform
      # e.g., deploy to Heroku, AWS, DigitalOcean, etc.
```

## Troubleshooting

If you encounter issues with your deployment:

1. Check the application logs:
   ```
   pm2 logs calorie-counter-api
   ```

2. Verify environment variables are correctly set

3. Ensure MongoDB connection is working properly

4. Check for any firewall or network configuration issues

5. Verify that the built files exist in the dist directory

For further assistance, contact the development team or refer to the project documentation.