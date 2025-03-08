import { Request, Response } from 'express';
import mongoose from 'mongoose';
import FoodEntry, { IFoodEntry } from '../models/FoodEntry';
import { IUser } from '../models/User';

// Create a new food entry
export const createFoodEntry = async (req: Request, res: Response) => {
  try {
    const { name, calories, mealType, timestamp } = req.body;
    const user = req.user as IUser;

    const newEntry = new FoodEntry({
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
  } catch (error) {
    console.error('Create food entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating food entry'
    });
  }
};

// Get all food entries for a user
export const getAllFoodEntries = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { startDate, endDate } = req.query;
    
    let query: any = { user: user._id };
    
    // Add date filtering if provided
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const entries = await FoodEntry.find(query)
      .sort({ timestamp: -1 })
      .exec();

    res.status(200).json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (error) {
    console.error('Get food entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching food entries'
    });
  }
};

// Get food entries for a specific date
export const getFoodEntriesByDate = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { date } = req.params;
    
    // Create start and end of the specified date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const entries = await FoodEntry.find({
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
  } catch (error) {
    console.error('Get food entries by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching food entries for date'
    });
  }
};

// Update a food entry
export const updateFoodEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, calories, mealType, timestamp } = req.body;
    const user = req.user as IUser;

    // Check if the entry exists and belongs to the user
    const entry = await FoodEntry.findOne({
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
    const updatedEntry = await FoodEntry.findByIdAndUpdate(
      id,
      { name, calories, mealType, timestamp },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Food entry updated successfully',
      entry: updatedEntry
    });
  } catch (error) {
    console.error('Update food entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating food entry'
    });
  }
};

// Delete a food entry
export const deleteFoodEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as IUser;

    // Check if valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food entry ID'
      });
    }

    // Check if the entry exists and belongs to the user
    const entry = await FoodEntry.findOne({
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
    await FoodEntry.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Food entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete food entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting food entry'
    });
  }
};

// Get summary statistics for a date range
export const getFoodSummary = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Both startDate and endDate are required'
      });
    }
    
    // Parse dates
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    // Aggregate to get daily totals and meal type breakdowns
    const dailyTotals = await FoodEntry.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id),
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
  } catch (error) {
    console.error('Get food summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating food summary'
    });
  }
};

export default {
  createFoodEntry,
  getAllFoodEntries,
  getFoodEntriesByDate,
  updateFoodEntry,
  deleteFoodEntry,
  getFoodSummary
};