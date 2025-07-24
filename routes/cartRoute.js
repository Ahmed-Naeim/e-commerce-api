const express = require('express');
const router = express.Router();

const {
    getLoggedUserCart,
    addToCart,
    clearCart,
    updateCartItemQuantity,
    deleteCartItem,
    applyCoupon
} = require('../services/cartService');

const authService = require('../services/authService');


router.use(authService.protect, authService.allowedTo('user')); // Protect all routes in this file

router.route('/')
    .get(getLoggedUserCart)
    .post(addToCart)
    .delete(clearCart);

router.route('/:itemId')
    .delete(deleteCartItem)
    .patch(updateCartItemQuantity);

router.put('/applyCoupon', applyCoupon);


module.exports = router;