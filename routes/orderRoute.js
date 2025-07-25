const express = require('express');
const router = express.Router();
const {
    createCashOrder,
    findAllOrders,
    findSpecificOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    filterOrderForLoggedUser,
    checkoutSession
} = require('../services/orderService');

const authService = require('../services/authService');

router.use(authService.protect);


router.get(
    '/checkout-session/:cartId',
    authService.allowedTo('user'),
    checkoutSession
);

router.route('/:cartId').post(authService.allowedTo('user'), createCashOrder);
router.get(
    '/',
    authService.allowedTo('user', 'admin', 'manager'),
    filterOrderForLoggedUser,
    findAllOrders
);

router.get('/:id',
    authService.allowedTo('user', 'admin', 'manager'),
    findSpecificOrder);

router.put(
    '/:id/pay',
    authService.allowedTo('admin', 'manager'),
    updateOrderToPaid
);
router.put(
    '/:id/deliver',
    authService.allowedTo('admin', 'manager'),
    updateOrderToDelivered
);

module.exports = router;

