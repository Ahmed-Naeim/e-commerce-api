const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        unique: [true, 'Product title must be unique'],
        minlength: [3, 'Product title must be at least 3 characters long'],
        maxlength: [100, 'Product title must not exceed 100 characters']
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [10, 'Product description must be at least 10 characters long'],
        maxlength: [500, 'Product description must not exceed 500 characters']
    },
    colors: {
        type: [String]
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Product price must be a positive number']
    },
    priceAfterDiscount: {
        type: Number,
        min: [0, 'Price after discount must be a positive number']
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: [0, 'Product quantity must be a positive number']
    },
    sold: {
        type: Number,
        default: 0,
        min: [0, 'Sold quantity must be a positive number']
    },
    imageCover: {
        type: String,
        required: [true, 'Product cover image is required']
    },
    images: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one image is required'
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    ratingsAverage: {
        type: Number,
        default: 0,
        min: [0, 'Ratings average must be a positive number'],
        max: [5, 'Ratings average cannot exceed 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
        min: [0, 'Ratings quantity must be a positive number']
    }
}, { timestamps: true });

productSchema.pre(/^find/, function (next) { //to populate category name
	this.populate ({
		path: 'category',
		select: 'name'
});
next();
});


const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;

