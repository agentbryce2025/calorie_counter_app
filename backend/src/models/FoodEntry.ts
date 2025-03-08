import mongoose, { Document, Schema } from 'mongoose';

export interface IFoodEntry extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  calories: number;
  mealType: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const foodEntrySchema = new Schema<IFoodEntry>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  }
},
{
  timestamps: true
});

// Index for better query performance
foodEntrySchema.index({ user: 1, timestamp: -1 });

export default mongoose.model<IFoodEntry>('FoodEntry', foodEntrySchema);