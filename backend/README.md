# Calorie Counter App - Backend API

This is the backend API for the Calorie Counter App, providing authentication and data storage services.

## Features

- **Authentication**: JWT-based authentication system
- **User Management**: Register, login, and profile endpoints
- **Food Entry API**: CRUD operations for food entries
- **Data Summary**: Endpoints for generating reports and analytics

## Tech Stack

- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose for data storage
- JWT for authentication
- bcryptjs for password hashing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get authentication token
- `GET /api/auth/profile` - Get current user profile (requires authentication)

### Food Entries
- `GET /api/food-entries` - Get all food entries for current user
- `GET /api/food-entries/date/:date` - Get entries for a specific date
- `GET /api/food-entries/summary` - Get summary statistics
- `POST /api/food-entries` - Create a new food entry
- `PUT /api/food-entries/:id` - Update a food entry
- `DELETE /api/food-entries/:id` - Delete a food entry

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with the following:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=mongodb://localhost:27017/calorie_tracker
   ```

3. Start development server:
   ```
   npm run dev
   ```

4. For production:
   ```
   npm run build
   npm start
   ```

## Future Enhancements

- Add data validation with express-validator
- Implement rate limiting
- Add unit and integration tests
- Add database seeding scripts