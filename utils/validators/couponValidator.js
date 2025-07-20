const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const ApiError = require('../apiError');
const Coupon = require('../../models/couponModel');

exports.createCouponValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be between 3 and 100 characters long'),
    check('discount')
        .notEmpty()
        .withMessage('Discount is required')
        .isNumeric()
        .withMessage('Discount must be a number')
        .custom((value) => {
            if (value < 0 || value > 100) {
                throw new ApiError('Discount must be between 0 and 100', 400);
            }
            return true;
        }),
    check('expiryDate')
        .notEmpty()
        .withMessage('Expiry date is required')
        .isDate()
        .withMessage('Expiry date must be a valid date')
];
exports.getCouponValidator = [
    check('id')
        .notEmpty()
        .withMessage('Coupon ID is required')
        .isMongoId()
        .withMessage('Invalid Coupon ID format')
        .custom(async (value) => {
            const coupon = await Coupon.findById(value);
            if (!coupon) {
                throw new ApiError('Coupon not found', 404);
            }
        })
];

exports.updateCouponValidator = [
    check('id')
        .notEmpty()
        .withMessage('Coupon ID is required')
        .isMongoId()
        .withMessage('Invalid Coupon ID format')
        .custom(async (value) => {
            const coupon = await Coupon.findById(value);
            if (!coupon) {
                throw new ApiError('Coupon not found', 404);
            }
        }),
    check('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be between 3 and 100 characters long'),
    check('discount')
        .optional()
        .isNumeric()
        .withMessage('Discount must be a number')
        .custom((value) => {
            if (value < 0 || value > 100) {
                throw new ApiError('Discount must be between 0 and 100', 400);
            }
            return true;
        }),
    check('expiryDate')
        .optional()
        .isDate()
        .withMessage('Expiry date must be a valid date')
];

exports.deleteCouponValidator = [
    check('id')
        .notEmpty()
        .withMessage('Coupon ID is required')
        .isMongoId()
        .withMessage('Invalid Coupon ID format')
        .custom(async (value) => {
            const coupon = await Coupon.findById(value);
            if (!coupon) {
                throw new ApiError('Coupon not found', 404);
            }
        })
];
