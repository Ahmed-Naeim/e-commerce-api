const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const ApiError = require('../apiError');
const User = require('../../models/userModel');
const Product = require('../../models/productModel');

exports.addToWishlistValidator = [
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (value, {req}) => {
            const product = await Product.findById(value);
            if (!product) {
                throw new ApiError('Product not found', 404);
            }
        })
];

exports.getLoggedUserWishlistValidator = [
    check('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid User ID format')
        .custom(async (value, {req}) => {
            const user = await User.findById(value);
            if (!user) {
                throw new ApiError('User not found', 404);
            }
        })
];

exports.removeProductFromWishlistValidator = [
    check('id')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (value, {req}) => {
            const product = await Product.findById(value);
            if (!product) {
                throw new ApiError('Product not found', 404);
            }
        }),
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .custom(async (value, {req}) => {
            const product = await Product.findById(req.params.productId);
            if (!product) {
                throw new ApiError('Product not found', 404);
            }
        })
];