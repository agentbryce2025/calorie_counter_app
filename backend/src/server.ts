import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import foodEntryRoutes from './routes/foodEntryRoutes';
import { connectDB } from './config/db';
import { setupSwagger } from './config/swagger';
import { apiLimiter, authLimiter } from './middleware/rateLimit';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5005;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet()); // Add various HTTP headers for security

// Apply rate limiters to specific routes
app.use('/api/auth', authLimiter); // Stricter limit for auth endpoints

// Setup Swagger documentation
setupSwagger(app);

// Basic route for testing
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is running' });
});

// Apply routes with rate limiting
app.use('/api/auth', authRoutes);
app.use('/api/food-entries', apiLimiter, foodEntryRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});

export default app;