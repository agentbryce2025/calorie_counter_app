import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPreferences:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user preferences
 *         userId:
 *           type: string
 *           description: The user ID these preferences belong to
 *         calorieGoal:
 *           type: number
 *           description: Daily calorie goal
 *           default: 2000
 *         macroGoals:
 *           type: object
 *           properties:
 *             protein:
 *               type: number
 *               description: Daily protein goal in grams
 *               default: 150
 *             carbs:
 *               type: number
 *               description: Daily carbs goal in grams
 *               default: 200
 *             fat:
 *               type: number
 *               description: Daily fat goal in grams
 *               default: 65
 *         mealTimes:
 *           type: object
 *           properties:
 *             breakfast:
 *               type: string
 *               description: Preferred breakfast time in HH:MM format
 *               default: "08:00"
 *             lunch:
 *               type: string
 *               description: Preferred lunch time in HH:MM format
 *               default: "12:00"
 *             dinner:
 *               type: string
 *               description: Preferred dinner time in HH:MM format
 *               default: "18:00"
 *             snacks:
 *               type: array
 *               items:
 *                 type: string
 *               description: Preferred snack times in HH:MM format
 *               default: ["10:30", "15:30"]
 *         dietaryRestrictions:
 *           type: array
 *           items:
 *             type: string
 *           description: Dietary restrictions or preferences
 *           default: []
 *         theme:
 *           type: string
 *           enum: [light, dark]
 *           description: UI theme preference
 *           default: "light"
 *         emailNotifications:
 *           type: boolean
 *           description: Email notification preference
 *           default: true
 *         weeklyReport:
 *           type: boolean
 *           description: Weekly report email preference
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when preferences were created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when preferences were last updated
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         userId: 60d21b4667d0d8992e610c84
 *         calorieGoal: 2200
 *         macroGoals:
 *           protein: 180
 *           carbs: 220
 *           fat: 70
 *         mealTimes:
 *           breakfast: "07:30"
 *           lunch: "13:00"
 *           dinner: "19:30"
 *           snacks: ["10:30", "16:00"]
 *         dietaryRestrictions: ["vegetarian", "no-gluten"]
 *         theme: "dark"
 *         emailNotifications: true
 *         weeklyReport: true
 *         createdAt: "2023-03-08T09:12:44.123Z"
 *         updatedAt: "2023-03-08T14:55:39.518Z"
 */
export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId | string;
  calorieGoal: number;
  macroGoals: {
    protein: number; // in grams
    carbs: number;   // in grams
    fat: number;     // in grams
  };
  mealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
  dietaryRestrictions: string[];
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  weeklyReport: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    calorieGoal: {
      type: Number,
      default: 2000
    },
    macroGoals: {
      protein: {
        type: Number,
        default: 150
      },
      carbs: {
        type: Number,
        default: 200
      },
      fat: {
        type: Number,
        default: 65
      }
    },
    mealTimes: {
      breakfast: {
        type: String,
        default: '08:00'
      },
      lunch: {
        type: String,
        default: '12:00'
      },
      dinner: {
        type: String,
        default: '18:00'
      },
      snacks: {
        type: [String],
        default: ['10:30', '15:30']
      }
    },
    dietaryRestrictions: {
      type: [String],
      default: []
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    weeklyReport: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUserPreferences>('UserPreferences', UserPreferencesSchema);