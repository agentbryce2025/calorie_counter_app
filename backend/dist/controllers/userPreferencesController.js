"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserPreferences = exports.updateUserPreferences = exports.getUserPreferences = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const UserPreferences_1 = __importDefault(require("../models/UserPreferences"));
// Get user preferences
const getUserPreferences = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const preferences = await UserPreferences_1.default.findOne({ userId });
        if (!preferences) {
            // Create default preferences if none exist
            const newPreferences = new UserPreferences_1.default({ userId });
            await newPreferences.save();
            return res.status(200).json(newPreferences);
        }
        return res.status(200).json(preferences);
    }
    catch (error) {
        console.error('Error getting user preferences:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.getUserPreferences = getUserPreferences;
// Update user preferences
const updateUserPreferences = async (req, res) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const { calorieGoal, macroGoals, mealTimes, dietaryRestrictions, theme, emailNotifications, weeklyReport } = req.body;
        // Build preferences object
        const preferencesFields = {};
        if (calorieGoal !== undefined)
            preferencesFields.calorieGoal = calorieGoal;
        if (macroGoals) {
            preferencesFields.macroGoals = {};
            if (macroGoals.protein !== undefined)
                preferencesFields.macroGoals.protein = macroGoals.protein;
            if (macroGoals.carbs !== undefined)
                preferencesFields.macroGoals.carbs = macroGoals.carbs;
            if (macroGoals.fat !== undefined)
                preferencesFields.macroGoals.fat = macroGoals.fat;
        }
        if (mealTimes) {
            preferencesFields.mealTimes = {};
            if (mealTimes.breakfast !== undefined)
                preferencesFields.mealTimes.breakfast = mealTimes.breakfast;
            if (mealTimes.lunch !== undefined)
                preferencesFields.mealTimes.lunch = mealTimes.lunch;
            if (mealTimes.dinner !== undefined)
                preferencesFields.mealTimes.dinner = mealTimes.dinner;
            if (mealTimes.snacks !== undefined)
                preferencesFields.mealTimes.snacks = mealTimes.snacks;
        }
        if (dietaryRestrictions !== undefined)
            preferencesFields.dietaryRestrictions = dietaryRestrictions;
        if (theme !== undefined)
            preferencesFields.theme = theme;
        if (emailNotifications !== undefined)
            preferencesFields.emailNotifications = emailNotifications;
        if (weeklyReport !== undefined)
            preferencesFields.weeklyReport = weeklyReport;
        let preferences = await UserPreferences_1.default.findOne({ userId });
        if (preferences) {
            // Update existing preferences
            preferences = await UserPreferences_1.default.findOneAndUpdate({ userId }, { $set: preferencesFields }, { new: true });
            return res.status(200).json(preferences);
        }
        // Create preferences if not found
        const newPreferences = new UserPreferences_1.default({
            userId,
            ...preferencesFields
        });
        await newPreferences.save();
        return res.status(201).json(newPreferences);
    }
    catch (error) {
        console.error('Error updating user preferences:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.updateUserPreferences = updateUserPreferences;
// Reset user preferences to defaults
const resetUserPreferences = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        // Delete existing preferences
        await UserPreferences_1.default.findOneAndDelete({ userId });
        // Create new preferences with defaults
        const newPreferences = new UserPreferences_1.default({ userId });
        await newPreferences.save();
        return res.status(200).json(newPreferences);
    }
    catch (error) {
        console.error('Error resetting user preferences:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.resetUserPreferences = resetUserPreferences;
