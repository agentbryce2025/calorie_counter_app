"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
dotenv_1.default.config();
let mongoServer;
// Connect to MongoDB
const connectDB = async () => {
    try {
        // Use MongoDB Memory Server for development/testing
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            console.log(`Using MongoDB Memory Server at: ${mongoUri}`);
            await mongoose_1.default.connect(mongoUri);
        }
        else {
            // Use real MongoDB for production
            const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/calorie-counter';
            const conn = await mongoose_1.default.connect(MONGO_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error: ${errorMessage}`);
        // Exit process with failure
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Graceful shutdown
const closeDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('MongoDB connection closed');
        if (mongoServer) {
            await mongoServer.stop();
            console.log('MongoDB Memory Server stopped');
        }
    }
    catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
};
exports.closeDB = closeDB;
exports.default = { connectDB: exports.connectDB, closeDB: exports.closeDB };
