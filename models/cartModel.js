const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    cartItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
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
    totalCartPrice:{
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    totalPriceAfterDiscount: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema);
