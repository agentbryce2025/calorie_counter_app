# Production Deployment Guide

This document provides detailed instructions for deploying the Calorie Counter application to production.

## Prerequisites

- A server or cloud instance running Linux (Ubuntu 20.04+ recommended)
- Docker and Docker Compose installed
- Node.js 14+ and npm installed
- PM2 installed globally (`npm install -g pm2`)
- Nginx installed
- MongoDB Atlas account (or another MongoDB hosting solution)
- Domain name (optional but recommended)

## Deployment Options

This guide provides three deployment options:

1. **Docker Deployment** (Recommended for most use cases)
2. **PM2 Deployment** (For Node.js-optimized environments)
3. **Cloud Platform** (Heroku, DigitalOcean App Platform, etc.)

## Option 1: Docker Deployment

### 1. Set Up Environment Variables

1. In the backend directory, copy `.env.example` to `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit the `.env` file with your production values:
   - Set `MONGO_URI` to your MongoDB Atlas connection string
   - Set a strong, unique `JWT_SECRET`
   - Configure `CORS_ORIGIN` to your frontend domain

### 2. Deploy with Docker Compose

1. From the project root, run:
   ```bash
   docker-compose up -d --build
   ```

2. Verify the containers are running:
   ```bash
   docker-compose ps
   ```

3. Check the logs:
   ```bash
   docker-compose logs -f
   ```

## Option 2: PM2 Deployment

### 1. Set Up Environment Variables

1. Follow the same environment setup as in the Docker deployment.

### 2. Build the Application

1. Build the backend:
   ```bash
   cd backend
   npm ci
   npm run build
   ```

2. Build the frontend:
   ```bash
   cd ..
   npm ci
   npm run build
   ```

### 3. Configure PM2

1. Use the provided ecosystem.config.js in the backend directory.

2. Start the backend with PM2:
   ```bash
   cd backend
   pm2 start ecosystem.config.js
   ```

3. Set up PM2 to start on system boot:
   ```bash
   pm2 startup
   pm2 save
   ```

### 4. Configure Nginx

1. Copy the frontend build to Nginx web root:
   ```bash
   sudo cp -r build/* /var/www/html/
   ```

2. Use the provided nginx.conf as a starting point:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/calorie-counter
   ```

3. Create a symbolic link to enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/calorie-counter /etc/nginx/sites-enabled/
   ```

4. Test and restart Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Option 3: Cloud Platform Deployment

### Heroku Deployment

1. Install the Heroku CLI and login:
   ```bash
   heroku login
   ```

2. Create Heroku apps for both frontend and backend:
   ```bash
   heroku create calorie-counter-api
   heroku create calorie-counter-frontend
   ```

3. Set up environment variables for the backend:
   ```bash
   heroku config:set NODE_ENV=production JWT_SECRET=your_jwt_secret MONGO_URI=your_mongo_uri -a calorie-counter-api
   ```

4. Deploy the backend:
   ```bash
   git subtree push --prefix backend heroku-api main
   ```

5. Deploy the frontend:
   ```bash
   git subtree push --prefix frontend heroku-frontend main
   ```

## GitHub Actions CI/CD

The CI/CD pipeline is configured in `.github/workflows/deploy.yml`. To use it:

1. Add the following secrets to your GitHub repository:
   - `SSH_HOST`: Your server IP or hostname
   - `SSH_USERNAME`: SSH username
   - `SSH_PRIVATE_KEY`: SSH private key for authentication

2. Push to the main branch to trigger the workflow.

## Monitoring and Maintenance

1. Use PM2 for monitoring:
   ```bash
   pm2 monit
   ```

2. For Docker deployments, use Docker's built-in monitoring:
   ```bash
   docker stats
   ```

3. Consider integrating with monitoring services like:
   - New Relic
   - Datadog
   - Sentry

## Backup Strategy

1. Set up a daily backup of your MongoDB database.

2. Create regular backups of your environment configuration files.

## Security Considerations

1. Ensure HTTPS is enabled (use Let's Encrypt for free certificates).

2. Regularly update dependencies:
   ```bash
   npm audit fix
   ```

3. Review and adjust rate limiting settings as needed.

4. Implement a firewall and restrict access to your server.

## Troubleshooting

If you encounter issues:

1. Check application logs:
   ```bash
   # For PM2
   pm2 logs calorie-counter-api
   
   # For Docker
   docker-compose logs api
   ```

2. Verify database connectivity.

3. Check for environment configuration issues.

4. Review Nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

For additional help, refer to the project documentation or contact the development team.