import express from 'express';
import {
  createFoodEntry,
  getAllFoodEntries,
  getFoodEntriesByDate,
  updateFoodEntry,
  deleteFoodEntry,
  getFoodSummary
} from '../controllers/foodEntryController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createFoodEntryValidator,
  updateFoodEntryValidator,
  getFoodEntriesByDateValidator,
  deleteFoodEntryValidator,
  getFoodSummaryValidator
} from '../validators/foodEntryValidators';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Food entry CRUD operations with validation
router.post('/', validate(createFoodEntryValidator), createFoodEntry);
router.get('/', getAllFoodEntries);
router.get('/date/:date', validate(getFoodEntriesByDateValidator), getFoodEntriesByDate);
router.get('/summary', validate(getFoodSummaryValidator), getFoodSummary);
router.put('/:id', validate(updateFoodEntryValidator), updateFoodEntry);
router.delete('/:id', validate(deleteFoodEntryValidator), deleteFoodEntry);

export default router;