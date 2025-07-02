const express = require('express');
const router = express.Router({mergeParams: true}); //to merge the params from the parent route productRoute
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
    deleteReview,
    createFilterObj,
    setProductIdAndUserIdToBody
} = require('../services/reviewService');

const authService = require('../services/authService');



router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('user'),
        createReviewValidator,
        setProductIdAndUserIdToBody, // to set product ID and user ID in the body for nested routes
        createReview)

    .get(getReviewsValidator,
        createFilterObj, // to create filter object for nested routes
        getReviews);

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