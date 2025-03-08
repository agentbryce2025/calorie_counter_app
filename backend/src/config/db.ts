import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongoServer: MongoMemoryServer;

// Connect to MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    // Use MongoDB Memory Server for development/testing
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      console.log(`Using MongoDB Memory Server at: ${mongoUri}`);
      
      await mongoose.connect(mongoUri);
    } else {
      // Use real MongoDB for production
      const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calorie-counter';
      const conn = await mongoose.connect(MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error: ${errorMessage}`);
    // Exit process with failure
    process.exit(1);
  }
};

// Graceful shutdown
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    if (mongoServer) {
      await mongoServer.stop();
      console.log('MongoDB Memory Server stopped');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

export default { connectDB, closeDB };