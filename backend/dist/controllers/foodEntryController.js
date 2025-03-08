"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoodSummary = exports.deleteFoodEntry = exports.updateFoodEntry = exports.getFoodEntriesByDate = exports.getAllFoodEntries = exports.createFoodEntry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FoodEntry_1 = __importDefault(require("../models/FoodEntry"));
// Create a new food entry
const createFoodEntry = async (req, res) => {
    try {
        const { name, calories, mealType, timestamp } = req.body;
        const user = req.user;
        const newEntry = new FoodEntry_1.default({
            user: user._id,
            name,
            calories,
            mealType,
            timestamp: timestamp || new Date()
        });
        const savedEntry = await newEntry.save();
        res.status(201).json({
            success: true,
            message: 'Food entry created successfully',
            entry: savedEntry
        });
    }
    catch (error) {
        console.error('Create food entry error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating food entry'
        });
    }
};
exports.createFoodEntry = createFoodEntry;
// Get all food entries for a user
const getAllFoodEntries = async (req, res) => {
    try {
        const user = req.user;
        const { startDate, endDate } = req.query;
        let query = { user: user._id };
        // Add date filtering if provided
        if (startDate && endDate) {
            query.timestamp = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const entries = await FoodEntry_1.default.find(query)
            .sort({ timestamp: -1 })
            .exec();
        res.status(200).json({
            success: true,
            count: entries.length,
            entries
        });
    }
    catch (error) {
        console.error('Get food entries error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching food entries'
        });
    }
};
exports.getAllFoodEntries = getAllFoodEntries;
// Get food entries for a specific date
const getFoodEntriesByDate = async (req, res) => {
    try {
        const user = req.user;
        const { date } = req.params;
        // Create start and end of the specified date
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const entries = await FoodEntry_1.default.find({
            user: user._id,
            timestamp: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ timestamp: 1 });
        res.status(200).json({
            success: true,
            count: entries.length,
            entries
        });
    }
    catch (error) {
        console.error('Get food entries by date error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching food entries for date'
        });
    }
};
exports.getFoodEntriesByDate = getFoodEntriesByDate;
// Update a food entry
const updateFoodEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, calories, mealType, timestamp } = req.body;
        const user = req.user;
        // Check if the entry exists and belongs to the user
        const entry = await FoodEntry_1.default.findOne({
            _id: id,
            user: user._id
        });
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Food entry not found or you do not have permission'
            });
        }
        // Update the entry
        const updatedEntry = await FoodEntry_1.default.findByIdAndUpdate(id, { name, calories, mealType, timestamp }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: 'Food entry updated successfully',
            entry: updatedEntry
        });
    }
    catch (error) {
        console.error('Update food entry error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating food entry'
        });
    }
};
exports.updateFoodEntry = updateFoodEntry;
// Delete a food entry
const deleteFoodEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        // Check if valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid food entry ID'
            });
        }
        // Check if the entry exists and belongs to the user
        const entry = await FoodEntry_1.default.findOne({
            _id: id,
            user: user._id
        });
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Food entry not found or you do not have permission'
            });
        }
        // Delete the entry
        await FoodEntry_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Food entry deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete food entry error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting food entry'
        });
    }
};
exports.deleteFoodEntry = deleteFoodEntry;
// Get summary statistics for a date range
const getFoodSummary = async (req, res) => {
    try {
        const user = req.user;
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Both startDate and endDate are required'
            });
        }
        // Parse dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Aggregate to get daily totals and meal type breakdowns
        const dailyTotals = await FoodEntry_1.default.aggregate([
            {
                $match: {
                    user: new mongoose_1.default.Types.ObjectId(user._id),
                    timestamp: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                        mealType: '$mealType'
                    },
                    totalCalories: { $sum: '$calories' },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.date',
                    mealTypes: {
                        $push: {
                            type: '$_id.mealType',
                            calories: '$totalCalories',
                            count: '$count'
                        }
                    },
                    dailyTotal: { $sum: '$totalCalories' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({
            success: true,
            summary: dailyTotals
        });
    }
    catch (error) {
        console.error('Get food summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error generating food summary'
        });
    }
};
exports.getFoodSummary = getFoodSummary;
exports.default = {
    createFoodEntry: exports.createFoodEntry,
    getAllFoodEntries: exports.getAllFoodEntries,
    getFoodEntriesByDate: exports.getFoodEntriesByDate,
    updateFoodEntry: exports.updateFoodEntry,
    deleteFoodEntry: exports.deleteFoodEntry,
    getFoodSummary: exports.getFoodSummary
};
