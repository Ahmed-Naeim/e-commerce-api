const Coupon = require('../models/couponModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');


exports.createCoupon = factory.createOne(Coupon);

exports.getCoupons = factory.getAll(Coupon, 'Coupons');

exports.getCoupon = factory.getOne(Coupon);

exports.updateCoupon = factory.updateOne(Coupon);

exports.deleteCoupon = factory.deleteOne(Coupon);