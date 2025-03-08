"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
// Middleware to check validation results
const validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty())
                break;
        }
        // Check if there are validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        // Return validation errors
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    };
};
exports.validate = validate;
exports.default = exports.validate;
