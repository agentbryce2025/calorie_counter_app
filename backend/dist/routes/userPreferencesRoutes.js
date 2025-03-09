"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userPreferencesController_1 = require("../controllers/userPreferencesController");
const userPreferencesValidator_1 = require("../validators/userPreferencesValidator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
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
router.get('/', authMiddleware_1.authenticate, userPreferencesController_1.getUserPreferences);
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
router.put('/', authMiddleware_1.authenticate, userPreferencesValidator_1.updateUserPreferencesValidator, userPreferencesController_1.updateUserPreferences);
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
router.post('/reset', authMiddleware_1.authenticate, userPreferencesController_1.resetUserPreferences);
exports.default = router;
