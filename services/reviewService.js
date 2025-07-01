const Review = require('../models/reviewModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');

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