"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoodSummaryValidator = exports.deleteFoodEntryValidator = exports.getFoodEntriesByDateValidator = exports.updateFoodEntryValidator = exports.createFoodEntryValidator = void 0;
const express_validator_1 = require("express-validator");
// Validate creating a new food entry
exports.createFoodEntryValidator = [
    (0, express_validator_1.body)('name')
        .notEmpty().withMessage('Food name is required')
        .isString().withMessage('Food name must be a string')
        .isLength({ max: 100 }).withMessage('Food name cannot exceed 100 characters'),
    (0, express_validator_1.body)('calories')
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
    (0, express_validator_1.body)('mealType')
        .notEmpty().withMessage('Meal type is required')
        .isString().withMessage('Meal type must be a string')
        .isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Meal type must be breakfast, lunch, dinner, or snack'),
    (0, express_validator_1.body)('timestamp')
        .notEmpty().withMessage('Timestamp is required')
        .isISO8601().withMessage('Timestamp must be a valid ISO8601 date')
];
// Validate updating a food entry
exports.updateFoodEntryValidator = [
    (0, express_validator_1.param)('id')
        .notEmpty().withMessage('Food entry ID is required')
        .isString().withMessage('Food entry ID must be a string'),
    (0, express_validator_1.body)('name')
        .optional()
        .isString().withMessage('Food name must be a string')
        .isLength({ max: 100 }).withMessage('Food name cannot exceed 100 characters'),
    (0, express_validator_1.body)('calories')
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
    (0, express_validator_1.body)('mealType')
        .optional()
        .isString().withMessage('Meal type must be a string')
        .isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Meal type must be breakfast, lunch, dinner, or snack'),
    (0, express_validator_1.body)('timestamp')
        .optional()
        .isISO8601().withMessage('Timestamp must be a valid ISO8601 date')
];
// Validate getting food entries by date
exports.getFoodEntriesByDateValidator = [
    (0, express_validator_1.param)('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid ISO8601 date format (YYYY-MM-DD)')
];
// Validate deletion of a food entry
exports.deleteFoodEntryValidator = [
    (0, express_validator_1.param)('id')
        .notEmpty().withMessage('Food entry ID is required')
        .isString().withMessage('Food entry ID must be a string')
];
// Validate getting food summary by date range
exports.getFoodSummaryValidator = [
    (0, express_validator_1.query)('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be a valid ISO8601 date format (YYYY-MM-DD)'),
    (0, express_validator_1.query)('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be a valid ISO8601 date format (YYYY-MM-DD)')
        .custom((endDate, { req }) => {
        if (req.query && req.query.startDate) {
            const startDate = new Date(req.query.startDate);
            const end = new Date(endDate);
            if (end < startDate) {
                throw new Error('End date must be after start date');
            }
        }
        return true;
    })
];
