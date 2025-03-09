import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import UserPreferences, { IUserPreferences } from '../models/UserPreferences';

// Get user preferences
export const getUserPreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const preferences = await UserPreferences.findOne({ userId });
    
    if (!preferences) {
      // Create default preferences if none exist
      const newPreferences = new UserPreferences({ userId });
      await newPreferences.save();
      return res.status(200).json(newPreferences);
    }
    
    return res.status(200).json(preferences);
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Update user preferences
export const updateUserPreferences = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const userId = req.user?.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const {
      calorieGoal,
      macroGoals,
      mealTimes,
      dietaryRestrictions,
      theme,
      emailNotifications,
      weeklyReport
    } = req.body;
    
    // Build preferences object
    const preferencesFields: Partial<IUserPreferences> = {};
    
    if (calorieGoal !== undefined) preferencesFields.calorieGoal = calorieGoal;
    
    if (macroGoals) {
      preferencesFields.macroGoals = {};
      if (macroGoals.protein !== undefined) preferencesFields.macroGoals.protein = macroGoals.protein;
      if (macroGoals.carbs !== undefined) preferencesFields.macroGoals.carbs = macroGoals.carbs;
      if (macroGoals.fat !== undefined) preferencesFields.macroGoals.fat = macroGoals.fat;
    }
    
    if (mealTimes) {
      preferencesFields.mealTimes = {};
      if (mealTimes.breakfast !== undefined) preferencesFields.mealTimes.breakfast = mealTimes.breakfast;
      if (mealTimes.lunch !== undefined) preferencesFields.mealTimes.lunch = mealTimes.lunch;
      if (mealTimes.dinner !== undefined) preferencesFields.mealTimes.dinner = mealTimes.dinner;
      if (mealTimes.snacks !== undefined) preferencesFields.mealTimes.snacks = mealTimes.snacks;
    }
    
    if (dietaryRestrictions !== undefined) preferencesFields.dietaryRestrictions = dietaryRestrictions;
    if (theme !== undefined) preferencesFields.theme = theme;
    if (emailNotifications !== undefined) preferencesFields.emailNotifications = emailNotifications;
    if (weeklyReport !== undefined) preferencesFields.weeklyReport = weeklyReport;
    
    let preferences = await UserPreferences.findOne({ userId });
    
    if (preferences) {
      // Update existing preferences
      preferences = await UserPreferences.findOneAndUpdate(
        { userId },
        { $set: preferencesFields },
        { new: true }
      );
      return res.status(200).json(preferences);
    }
    
    // Create preferences if not found
    const newPreferences = new UserPreferences({
      userId,
      ...preferencesFields
    });
    
    await newPreferences.save();
    return res.status(201).json(newPreferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Reset user preferences to defaults
export const resetUserPreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Delete existing preferences
    await UserPreferences.findOneAndDelete({ userId });
    
    // Create new preferences with defaults
    const newPreferences = new UserPreferences({ userId });
    await newPreferences.save();
    
    return res.status(200).json(newPreferences);
  } catch (error) {
    console.error('Error resetting user preferences:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};