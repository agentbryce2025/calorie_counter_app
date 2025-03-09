"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const foodEntryController_1 = require("../controllers/foodEntryController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const foodEntryValidators_1 = require("../validators/foodEntryValidators");
/**
 * @swagger
 * tags:
 *   name: Food Entries
 *   description: API endpoints for managing food entries
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     FoodEntry:
 *       type: object
 *       required:
 *         - name
 *         - calories
 *         - mealType
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the food entry
 *         name:
 *           type: string
 *           description: The name of the food
 *         calories:
 *           type: number
 *           description: The calorie count of the food
 *         mealType:
 *           type: string
 *           enum: [breakfast, lunch, dinner, snack]
 *           description: The meal type
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The date and time the food was consumed
 *         carbs:
 *           type: number
 *           description: Carbohydrates in grams
 *         protein:
 *           type: number
 *           description: Protein in grams
 *         fat:
 *           type: number
 *           description: Fat in grams
 *         userId:
 *           type: string
 *           description: The user who created this entry
 *       example:
 *         id: 60d21b4967d0d8992e610c85
 *         name: Chicken Salad
 *         calories: 350
 *         mealType: lunch
 *         timestamp: 2023-06-25T12:00:00Z
 *         carbs: 10
 *         protein: 30
 *         fat: 15
 *         userId: 60d21b4967d0d8992e610c80
 */
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
/**
 * @swagger
 * /api/food-entries:
 *   post:
 *     summary: Create a new food entry
 *     tags: [Food Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FoodEntry'
 *     responses:
 *       201:
 *         description: The food entry was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodEntry'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', (0, validate_1.validate)(foodEntryValidators_1.createFoodEntryValidator), foodEntryController_1.createFoodEntry);
/**
 * @swagger
 * /api/food-entries:
 *   get:
 *     summary: Returns the list of all food entries for the authenticated user
 *     tags: [Food Entries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of food entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FoodEntry'
 *       401:
 *         description: Unauthorized
 */
router.get('/', foodEntryController_1.getAllFoodEntries);
/**
 * @swagger
 * /api/food-entries/date/{date}:
 *   get:
 *     summary: Get food entries for a specific date
 *     tags: [Food Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Food entries for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FoodEntry'
 *       400:
 *         description: Invalid date format
 *       401:
 *         description: Unauthorized
 */
router.get('/date/:date', (0, validate_1.validate)(foodEntryValidators_1.getFoodEntriesByDateValidator), foodEntryController_1.getFoodEntriesByDate);
/**
 * @swagger
 * /api/food-entries/summary:
 *   get:
 *     summary: Get summary of food entries for a date range
 *     tags: [Food Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Summary data for the specified date range
 *       400:
 *         description: Invalid date format
 *       401:
 *         description: Unauthorized
 */
router.get('/summary', (0, validate_1.validate)(foodEntryValidators_1.getFoodSummaryValidator), foodEntryController_1.getFoodSummary);
/**
 * @swagger
 * /api/food-entries/{id}:
 *   put:
 *     summary: Update a food entry by ID
 *     tags: [Food Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The food entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FoodEntry'
 *     responses:
 *       200:
 *         description: The food entry was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FoodEntry'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Food entry not found
 */
router.put('/:id', (0, validate_1.validate)(foodEntryValidators_1.updateFoodEntryValidator), foodEntryController_1.updateFoodEntry);
/**
 * @swagger
 * /api/food-entries/{id}:
 *   delete:
 *     summary: Delete a food entry
 *     tags: [Food Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The food entry ID
 *     responses:
 *       200:
 *         description: Food entry deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Food entry not found
 */
router.delete('/:id', (0, validate_1.validate)(foodEntryValidators_1.deleteFoodEntryValidator), foodEntryController_1.deleteFoodEntry);
exports.default = router;
