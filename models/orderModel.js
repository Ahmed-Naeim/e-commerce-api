const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    taxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    paymentMethodType:{
        type: String,
        required: true,
        enum: ['COD', 'Online'],
        default: 'COD'
    },
    totalOrderPrice: {
        type: Number,
        required: true,
        default: 0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    shippingAddress: {
        name: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

orderSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name email phone'
    }).populate({
        path: 'cartItems.product',
        select: 'title price'
    });
    next();
});

module.exports = mongoose.model('Order', orderSchema);