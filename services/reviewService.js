const Review = require('../models/reviewModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');

/**
 * Middleware to set product ID for nested routes
 * GET /api/v1/products/:productId/reviews
 */
exports.createFilterObj = (req, res, next) => {
    let filterObj = {};
    if (req.params.productId) 
        filterObj.product = {product: req.params.productId};
    
    if (!req.body.product) 
        req.body.product = req.params.productId;
    
    req.filterObj = filterObj;
    next();
};

/**
 * Middleware to set product ID in the body from the params for nested routes
 * POST /api/v1/products/:productId/reviews
 */
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    // Set product ID from the params for nested routes
    if (!req.body.product) 
        req.body.product = req.params.productId;
    // Set user ID from the authenticated user
    if (!req.body.user) 
        req.body.user = req.user._id;
    next();
};

/**
 * @desc Create a new review
 * @route POST /api/v1/reviews
 * @access Private (user, Admin, Manager)
 */
exports.createReview = factory.createOne(Review);

/** 
 * @desc Get all reviews
 * @route GET /api/v1/reviews
 * @access Public
 */
exports.getReviews = factory.getAll(Review, 'Reviews');

/** 
 * @desc Get a single review by ID
 * @route GET /api/v1/reviews/:id
 * @access Public
 */
exports.getReview = factory.getOne(Review);

/**
 * @desc Update a review by ID
 * @route PUT /api/v1/reviews/:id
 * @access Private (Admin, Manager)
 */
exports.updateReview = factory.updateOne(Review);

/**
 * @desc Delete a review by ID
 * @route DELETE /api/v1/reviews/:id
 * @access Private (Admin)
 */
exports.deleteReview = factory.deleteOne(Review);