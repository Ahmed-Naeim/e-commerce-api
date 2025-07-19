const mongoose = require('mongoose');
const Product = require('./productModel');

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

reviewSchema.pre(/^find/, function(next) {
    this.populate({path: 'user', select: 'name email'}).populate({path: 'product', select: 'name price'});
    next();
});

reviewSchema.statics.calculateAverageRatings = async function(productId) {
    const result = await this.aggregate([
        { 
            //Stage 1: get all reviews for a product
            $match: { product: productId } 
        },
        {
            //Stage 2: group the data by their Ids and calculate the average ratings and ratings quantity
            $group: {
                _id: 'product',
                avgRatings: {$avg: '$ratings'},
                ratingsQuantity: {$sum: 1}
        }
        }
    ]);

    if(result.length > 0){
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            ratingsQuantity: result[0].ratingsQuantity
        });
    }else{
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        });
    }
}

// Call the calculateAverageRatings method after saving a review
reviewSchema.post('save', function() {
    this.constructor.calculateAverageRatings(this.product);
});

// Call the calculateAverageRatings method after deleting a review
reviewSchema.post('remove', function() {
    this.constructor.calculateAverageRatings(this.product);
});

const reviewModel = mongoose.model('Review', reviewSchema);

module.exports = reviewModel;