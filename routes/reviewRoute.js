const express = require('express');
const router = express.Router();
const {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
    getReviewsValidator
} = require("../utils/validators/reviewValidator");

const {
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
} = require('../services/reviewService');

const authService = require('../services/authService');


router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('user'),
        createReviewValidator,
        createReview)

    .get(getReviewsValidator, getReviews);

router.route('/:id')
    .get(getReviewValidator, getReview)
    .put(
        authService.protect,
        authService.allowedTo('user'),
        updateReviewValidator,
        updateReview)
    .delete(
        authService.protect,
        authService.allowedTo('user','manager' ,'admin'),
        deleteReviewValidator,
        deleteReview);

module.exports = router;