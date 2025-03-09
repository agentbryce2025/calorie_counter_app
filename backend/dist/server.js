"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const foodEntryRoutes_1 = __importDefault(require("./routes/foodEntryRoutes"));
const userPreferencesRoutes_1 = __importDefault(require("./routes/userPreferencesRoutes"));
const exportRoutes_1 = __importDefault(require("./routes/exportRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const db_1 = require("./config/db");
const swagger_1 = require("./config/swagger");
const rateLimit_1 = require("./middleware/rateLimit");
// Load environment variables
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5005;
// Connect to MongoDB
(0, db_1.connectDB)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)()); // Add various HTTP headers for security
// Apply rate limiters to specific routes
app.use('/api/auth', rateLimit_1.authLimiter); // Stricter limit for auth endpoints
// Setup Swagger documentation
(0, swagger_1.setupSwagger)(app);
// Basic route for testing
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});
// Apply routes with rate limiting
app.use('/api/auth', authRoutes_1.default);
app.use('/api/food-entries', rateLimit_1.apiLimiter, foodEntryRoutes_1.default);
app.use('/api/preferences', rateLimit_1.apiLimiter, userPreferencesRoutes_1.default);
app.use('/api/export', rateLimit_1.apiLimiter, exportRoutes_1.default);
app.use('/api/admin', rateLimit_1.apiLimiter, adminRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
exports.default = app;
