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
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Food entry CRUD operations with validation
router.post('/', (0, validate_1.validate)(foodEntryValidators_1.createFoodEntryValidator), foodEntryController_1.createFoodEntry);
router.get('/', foodEntryController_1.getAllFoodEntries);
router.get('/date/:date', (0, validate_1.validate)(foodEntryValidators_1.getFoodEntriesByDateValidator), foodEntryController_1.getFoodEntriesByDate);
router.get('/summary', (0, validate_1.validate)(foodEntryValidators_1.getFoodSummaryValidator), foodEntryController_1.getFoodSummary);
router.put('/:id', (0, validate_1.validate)(foodEntryValidators_1.updateFoodEntryValidator), foodEntryController_1.updateFoodEntry);
router.delete('/:id', (0, validate_1.validate)(foodEntryValidators_1.deleteFoodEntryValidator), foodEntryController_1.deleteFoodEntry);
exports.default = router;
