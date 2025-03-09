"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPreferencesValidator = void 0;
const express_validator_1 = require("express-validator");
exports.updateUserPreferencesValidator = [
    (0, express_validator_1.body)('calorieGoal')
        .optional()
        .isInt({ min: 500, max: 10000 })
        .withMessage('Calorie goal must be between 500 and 10000'),
    (0, express_validator_1.body)('macroGoals.protein')
        .optional()
        .isInt({ min: 0, max: 1000 })
        .withMessage('Protein goal must be between 0 and 1000 grams'),
    (0, express_validator_1.body)('macroGoals.carbs')
        .optional()
        .isInt({ min: 0, max: 1000 })
        .withMessage('Carbs goal must be between 0 and 1000 grams'),
    (0, express_validator_1.body)('macroGoals.fat')
        .optional()
        .isInt({ min: 0, max: 1000 })
        .withMessage('Fat goal must be between 0 and 1000 grams'),
    (0, express_validator_1.body)('mealTimes.breakfast')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Breakfast time must be in HH:MM format'),
    (0, express_validator_1.body)('mealTimes.lunch')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Lunch time must be in HH:MM format'),
    (0, express_validator_1.body)('mealTimes.dinner')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Dinner time must be in HH:MM format'),
    (0, express_validator_1.body)('mealTimes.snacks')
        .optional()
        .isArray()
        .withMessage('Snacks must be an array'),
    (0, express_validator_1.body)('mealTimes.snacks.*')
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Snack times must be in HH:MM format'),
    (0, express_validator_1.body)('dietaryRestrictions')
        .optional()
        .isArray()
        .withMessage('Dietary restrictions must be an array'),
    (0, express_validator_1.body)('dietaryRestrictions.*')
        .optional()
        .isString()
        .withMessage('Each dietary restriction must be a string'),
    (0, express_validator_1.body)('theme')
        .optional()
        .isIn(['light', 'dark'])
        .withMessage('Theme must be either light or dark'),
    (0, express_validator_1.body)('emailNotifications')
        .optional()
        .isBoolean()
        .withMessage('Email notifications must be a boolean'),
    (0, express_validator_1.body)('weeklyReport')
        .optional()
        .isBoolean()
        .withMessage('Weekly report preference must be a boolean')
];
