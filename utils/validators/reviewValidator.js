const slugify = require('slugify');
const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const ApiError = require('../apiError');
const Review = require('../../models/reviewModel');

exports.createReviewValidator = [
    check('title')
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ min: 2 })
    .withMessage('Review title must be at least 3 characters long')
    .isLength({ max: 100 })
    .withMessage('Review title must not exceed 100 characters')
    .optional()
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('ratings')
        .notEmpty()
        .withMessage('Review ratings is required')
        .isNumeric()
        .withMessage('Review ratings must be a number')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Review ratings must be between 1 and 5'),
    check('user')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid user ID format'),
    check('product')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID format')
        .custom(async (val, {req}) => {
            //check if logged user has created a review for the product
            const review = await Review.findOne({ product: req.body.product, user: req.user._id });
            if (review) {
                return Promise.reject(new ApiError('User has already reviewed this product', 400));
            }
            return true;
        }),
    validatorMiddleware,
];

exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid review id format'),
    validatorMiddleware,
];

exports.updateReviewValidator = [
    check('id').isMongoId().withMessage('Invalid review id format'),
    check('title')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Review title must be at least 3 characters long')
        .isLength({ max: 100 })
        .withMessage('Review title must not exceed 100 characters')
        .optional()
        .custom(async (val, { req }) => {
            const review = await Review.findById(req.params.id);
            if (!review) {
                return Promise.reject(new ApiError('Review not found', 404));
            }
            if (!review.user._id.toString() === req.user._id.toString()) {
                return Promise.reject(new ApiError('You are not authorized to update this review', 403));
            }
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.deleteReviewValidator = [
    check('id').isMongoId().withMessage('Invalid review id format')
        .custom(async (val, { req }) => {
            //check the ownership
            if (req.user.role !== 'user') {
                return Promise.reject(new ApiError('You are not authorized to delete this review', 403));
            }
            const review = await Review.findById(val);
            if (!review) {
                return Promise.reject(new ApiError('Review not found', 404));
            }
            if (!review.user._id.toString() === req.user._id.toString()) {
                return Promise.reject(new ApiError('You are not authorized to delete this review', 403));
            }
            return true;
        }),
    validatorMiddleware,
];

exports.getReviewsValidator = [
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