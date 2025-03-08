import { body, param, query } from 'express-validator';

// Validate creating a new food entry
export const createFoodEntryValidator = [
  body('name')
    .notEmpty().withMessage('Food name is required')
    .isString().withMessage('Food name must be a string')
    .isLength({ max: 100 }).withMessage('Food name cannot exceed 100 characters'),

  body('calories')
    .notEmpty().withMessage('Calories are required')
    .isNumeric().withMessage('Calories must be a number')
    .custom((value) => {
      if (parseInt(value) <= 0) {
        throw new Error('Calories must be greater than 0');
      }
      if (parseInt(value) > 10000) {
        throw new Error('Calories cannot exceed 10,000');
      }
      return true;
    }),

  body('mealType')
    .notEmpty().withMessage('Meal type is required')
    .isString().withMessage('Meal type must be a string')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Meal type must be breakfast, lunch, dinner, or snack'),

  body('timestamp')
    .notEmpty().withMessage('Timestamp is required')
    .isISO8601().withMessage('Timestamp must be a valid ISO8601 date')
];

// Validate updating a food entry
export const updateFoodEntryValidator = [
  param('id')
    .notEmpty().withMessage('Food entry ID is required')
    .isString().withMessage('Food entry ID must be a string'),

  body('name')
    .optional()
    .isString().withMessage('Food name must be a string')
    .isLength({ max: 100 }).withMessage('Food name cannot exceed 100 characters'),

  body('calories')
    .optional()
    .isNumeric().withMessage('Calories must be a number')
    .custom((value) => {
      if (parseInt(value) <= 0) {
        throw new Error('Calories must be greater than 0');
      }
      if (parseInt(value) > 10000) {
        throw new Error('Calories cannot exceed 10,000');
      }
      return true;
    }),

  body('mealType')
    .optional()
    .isString().withMessage('Meal type must be a string')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Meal type must be breakfast, lunch, dinner, or snack'),

  body('timestamp')
    .optional()
    .isISO8601().withMessage('Timestamp must be a valid ISO8601 date')
];

// Validate getting food entries by date
export const getFoodEntriesByDateValidator = [
  param('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid ISO8601 date format (YYYY-MM-DD)')
];

// Validate deletion of a food entry
export const deleteFoodEntryValidator = [
  param('id')
    .notEmpty().withMessage('Food entry ID is required')
    .isString().withMessage('Food entry ID must be a string')
];

// Validate getting food summary by date range
export const getFoodSummaryValidator = [
  query('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid ISO8601 date format (YYYY-MM-DD)'),
  
  query('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('End date must be a valid ISO8601 date format (YYYY-MM-DD)')
    .custom((endDate, { req }) => {
      const startDate = new Date(req.query.startDate as string);
      const end = new Date(endDate);
      if (end < startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];