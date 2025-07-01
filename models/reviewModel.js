const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: String,
    ratings:{
        type: Number,
        required: [true, 'Review must have a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5']
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
    ,product:{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product']
    },
},{timestamps: true});

// reviewSchema.index({product: 1, user: 1}, {unique: true}); // Ensure a user can only review a product once


const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;