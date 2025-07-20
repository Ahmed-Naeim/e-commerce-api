const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
