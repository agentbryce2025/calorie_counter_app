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

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Food entry CRUD operations
router.post('/', createFoodEntry);
router.get('/', getAllFoodEntries);
router.get('/date/:date', getFoodEntriesByDate);
router.get('/summary', getFoodSummary);
router.put('/:id', updateFoodEntry);
router.delete('/:id', deleteFoodEntry);

export default router;