const express = require('express');
const router = express.Router();
const {addToWishlist, getLoggedUserWishlist, removeProductFromWishlist} = require('../services/wishlistService');
const {addToWishlistValidator, getLoggedUserWishlistValidator, removeProductFromWishlistValidator} = require('../utils/validators/wishlistValidator');
const authService = require('../services/authService');

router.use(authService.protect);

router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('user'),
        addToWishlistValidator,
        addToWishlist
    )
    .get(
        authService.protect,
        authService.allowedTo('user'),
        getLoggedUserWishlistValidator,
        getLoggedUserWishlist
    );

router.route('/:productId')
    .delete(
        authService.protect,
        authService.allowedTo('user'),
        removeProductFromWishlistValidator,
        removeProductFromWishlist
    );



module.exports = router;
