"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password, dailyCalorieGoal } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }
        // Create new user
        const newUser = new User_1.default({
            username,
            email,
            password,
            dailyCalorieGoal: dailyCalorieGoal || 2000
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};
exports.register = register;
// Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find user by username
        const user = await User_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        // Remove password from response
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            dailyCalorieGoal: user.dailyCalorieGoal
        };
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};
exports.login = login;
// Get current user profile
const getProfile = async (req, res) => {
    try {
        // User should be attached by auth middleware
        const user = req.user;
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                dailyCalorieGoal: user.dailyCalorieGoal
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving profile'
        });
    }
};
exports.getProfile = getProfile;
exports.default = {
    register: exports.register,
    login: exports.login,
    getProfile: exports.getProfile
};
