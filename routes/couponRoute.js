const express = require('express');
const router = express.Router();

const {
    createCouponValidator,
    getCouponValidator,
    updateCouponValidator,
    deleteCouponValidator
} = require('../utils/validators/couponValidator');
const {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
} = require('../services/couponService');

const authService = require('../services/authService');

router.use(authService.protect, authService.allowedTo('admin', 'manager'));

router.route('/')
    .post(
        createCouponValidator,
        createCoupon)
    .get(getCoupons);

router.route('/:id')
    .get(
        getCouponValidator,
        getCoupon)
    .put(
        updateCouponValidator,
        updateCoupon)
    .delete(
        deleteCouponValidator,
        deleteCoupon);

module.exports = router;