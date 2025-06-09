const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

/**
 * Validator for category-related routes.
 * This module exports various validators for creating, updating, deleting, and retrieving categories.
 */
exports.getCategoriesValidator = [
    check('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    check('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    validatorMiddleware,
];

/**
 * Validator for retrieving a single category.
 * This validator checks if the provided category ID is a valid MongoDB ObjectId.
 * It ensures that the ID is in the correct format before proceeding with the request.
 */
exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];

/**
 * Validator for creating a new category.
 * This validator checks if the required fields for creating a category are present and valid.
 */
exports.createCategoryValidator = [
check('name')
    .notEmpty()
    .withMessage('Category required')
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name'),
    validatorMiddleware,
];

/**
 * Validator for updating an existing category.
 * This validator checks if the provided category ID is valid and if the optional fields for updating the category are valid.
 * It ensures that the ID is in the correct format and that the name, if provided, meets the length requirements.
 * This helps maintain data integrity and prevents invalid updates to the category.
 */
exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    check('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Too short category name')
        .isLength({ max: 32 })
        .withMessage('Too long category name'),
    validatorMiddleware,
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];