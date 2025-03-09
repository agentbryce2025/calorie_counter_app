FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./
RUN npm ci --only=production

# Copy all files
COPY dist ./dist

# Set environment to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 5005

# Start the application
CMD ["node", "dist/server.js"]