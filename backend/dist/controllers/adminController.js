"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStatus = exports.getUserDetails = exports.getUsers = exports.getSystemStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const FoodEntry_1 = __importDefault(require("../models/FoodEntry"));
const UserPreferences_1 = __importDefault(require("../models/UserPreferences"));
/**
 * Get system statistics for admin dashboard
 */
const getSystemStats = async (req, res) => {
    try {
        // Only allow admin users
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
        }
        // Get user stats
        const totalUsers = await User_1.default.countDocuments();
        const activeUsers = await User_1.default.countDocuments({ lastLoginDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
        const newUsers = await User_1.default.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
        // Get food entry stats
        const totalFoodEntries = await FoodEntry_1.default.countDocuments();
        const recentFoodEntries = await FoodEntry_1.default.countDocuments({ date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
        // Get average entries per user
        const avgEntriesPerUser = totalUsers > 0 ? totalFoodEntries / totalUsers : 0;
        // Get user activity by date (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const userActivityByDate = await FoodEntry_1.default.aggregate([
            {
                $match: {
                    date: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    count: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$user' }
                }
            },
            {
                $project: {
                    date: '$_id',
                    count: 1,
                    uniqueUsers: { $size: '$uniqueUsers' },
                    _id: 0
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);
        // Get top foods logged
        const topFoods = await FoodEntry_1.default.aggregate([
            {
                $group: {
                    _id: '$name',
                    count: { $sum: 1 },
                    totalCalories: { $sum: '$calories' }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    name: '$_id',
                    count: 1,
                    totalCalories: 1,
                    _id: 0
                }
            }
        ]);
        // Send the stats response
        res.json({
            userStats: {
                totalUsers,
                activeUsers,
                newUsers,
            },
            foodEntryStats: {
                totalFoodEntries,
                recentFoodEntries,
                avgEntriesPerUser: Math.round(avgEntriesPerUser * 100) / 100,
                topFoods
            },
            activity: userActivityByDate
        });
    }
    catch (error) {
        console.error('Error getting system stats:', error);
        res.status(500).json({ message: 'Error retrieving system statistics' });
    }
};
exports.getSystemStats = getSystemStats;
/**
 * Get list of users for admin management
 */
const getUsers = async (req, res) => {
    try {
        // Only allow admin users
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        // Get total count for pagination
        const totalUsers = await User_1.default.countDocuments();
        // Get users with pagination
        const users = await User_1.default.find()
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        // Send the user list with pagination info
        res.json({
            users,
            pagination: {
                total: totalUsers,
                page,
                limit,
                pages: Math.ceil(totalUsers / limit)
            }
        });
    }
    catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Error retrieving user list' });
    }
};
exports.getUsers = getUsers;
/**
 * Get specific user details including their food entries
 */
const getUserDetails = async (req, res) => {
    try {
        // Only allow admin users
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
        }
        const userId = req.params.userId;
        // Get user details
        const user = await User_1.default.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Get user's preferences
        const preferences = await UserPreferences_1.default.findOne({ user: userId });
        // Get user's food entries (latest 50)
        const recentEntries = await FoodEntry_1.default.find({ user: userId })
            .sort({ date: -1 })
            .limit(50);
        // Get entry counts
        const totalEntries = await FoodEntry_1.default.countDocuments({ user: userId });
        const lastMonthEntries = await FoodEntry_1.default.countDocuments({
            user: userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });
        // Send the combined user details
        res.json({
            user,
            preferences,
            entryCounts: {
                total: totalEntries,
                lastMonth: lastMonthEntries
            },
            recentEntries
        });
    }
    catch (error) {
        console.error('Error getting user details:', error);
        res.status(500).json({ message: 'Error retrieving user details' });
    }
};
exports.getUserDetails = getUserDetails;
/**
 * Update user status (active/inactive)
 */
const updateUserStatus = async (req, res) => {
    try {
        // Only allow admin users
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
        }
        const userId = req.params.userId;
        const { isActive } = req.body;
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'isActive must be a boolean value' });
        }
        // Update user status
        const user = await User_1.default.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            message: `User status updated to ${isActive ? 'active' : 'inactive'}`,
            user
        });
    }
    catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
};
exports.updateUserStatus = updateUserStatus;
exports.default = {
    getSystemStats: exports.getSystemStats,
    getUsers: exports.getUsers,
    getUserDetails: exports.getUserDetails,
    updateUserStatus: exports.updateUserStatus
};
