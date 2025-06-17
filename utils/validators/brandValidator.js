const slugify = require('slugify');
const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createBrandValidator = [
    check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isLength({ min: 2 })
    .withMessage('Brand name must be at least 3 characters long')
    .isLength({ max: 50 })
    .withMessage('Brand name must not exceed 50 characters')
    .optional()
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id format'),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id format'),
    check('name')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Brand name must be at least 3 characters long')
        .isLength({ max: 50 })
        .withMessage('Brand name must not exceed 50 characters')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id format'),
    validatorMiddleware,
];

exports.getBrandsValidator = [
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