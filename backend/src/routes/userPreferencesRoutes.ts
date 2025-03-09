import express from 'express';
import { 
  getUserPreferences, 
  updateUserPreferences, 
  resetUserPreferences 
} from '../controllers/userPreferencesController';
import { updateUserPreferencesValidator } from '../validators/userPreferencesValidator';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/preferences:
 *   get:
 *     summary: Get user preferences
 *     description: Retrieve preferences for the authenticated user
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreferences'
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, getUserPreferences);

/**
 * @swagger
 * /api/preferences:
 *   put:
 *     summary: Update user preferences
 *     description: Update preferences for the authenticated user
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calorieGoal:
 *                 type: number
 *                 description: Daily calorie goal
 *                 example: 2200
 *               macroGoals:
 *                 type: object
 *                 properties:
 *                   protein:
 *                     type: number
 *                     description: Daily protein goal in grams
 *                     example: 180
 *                   carbs:
 *                     type: number
 *                     description: Daily carbs goal in grams
 *                     example: 220
 *                   fat:
 *                     type: number
 *                     description: Daily fat goal in grams
 *                     example: 70
 *               mealTimes:
 *                 type: object
 *                 properties:
 *                   breakfast:
 *                     type: string
 *                     description: Preferred breakfast time in HH:MM format
 *                     example: "07:30"
 *                   lunch:
 *                     type: string
 *                     description: Preferred lunch time in HH:MM format
 *                     example: "13:00"
 *                   dinner:
 *                     type: string
 *                     description: Preferred dinner time in HH:MM format
 *                     example: "19:30"
 *                   snacks:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Preferred snack times in HH:MM format
 *                     example: ["10:30", "16:00"]
 *               dietaryRestrictions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Dietary restrictions or preferences
 *                 example: ["vegetarian", "no-gluten"]
 *               theme:
 *                 type: string
 *                 enum: [light, dark]
 *                 description: UI theme preference
 *                 example: "dark"
 *               emailNotifications:
 *                 type: boolean
 *                 description: Email notification preference
 *                 example: true
 *               weeklyReport:
 *                 type: boolean
 *                 description: Weekly report email preference
 *                 example: true
 *     responses:
 *       200:
 *         description: User preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreferences'
 *       201:
 *         description: User preferences created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreferences'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
router.put('/', authenticate, updateUserPreferencesValidator, updateUserPreferences);

/**
 * @swagger
 * /api/preferences/reset:
 *   post:
 *     summary: Reset user preferences to defaults
 *     description: Reset all preferences to system defaults for the authenticated user
 *     tags: [Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreferences'
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
router.post('/reset', authenticate, resetUserPreferences);

export default router;