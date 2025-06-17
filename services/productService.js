const Product = require('../models/productModel');
const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private (Admin)
 * @returns {Object} - The created product object
 */
const createProduct = asyncHandler(async (req, res) => {
    await Product.create({
        ...req.body,
        slug: slugify(req.body.title, { lower: true })
    });
    res.status(201).json({ success: true, message: 'Product created successfully' });
});

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @access  Public
 * @returns {Object} - An object containing the products and pagination info
 * NOTE it accepts pagination parameters `page` and `limit` in the query string. like ?page=1&limit=5
 */
const getProducts = asyncHandler(async (req, res) => {
    
    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj;
    }
    //Build Query
    const mongooseQuery = Product.find({}).skip(skip).limit(limit);

    //filter

    //take a copy of the req.query to apply the filter on without affecting the original req.query
    const queryStringObj = {...req.query};
    const excludesFields = ['page', 'sort','limit','fields'];
    excludesFields.forEach((field) => delete queryStringObj[field]);
    //we need to convert the object to string to use RegEx for gte, gt, lte, lt
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`); 
    // we de  \b before and after the string to make it needed to have space before and after 
    // and don’t get strings that these gte, gt.. are a part of its words 
    // and we use \g to get all the strings this conditions applied on not the first one only

    //parse the string into JSON to return it
    mongooseQuery = mongooseQuery.find(JSON.parse(queryStr));


    //Pagination
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    //Sorting
    if(req.query.sort){ //ascending by default
        const sortBy = req.query.sort.split(',').joint(' ');
        mongooseQuery = mongooseQuery.sort(sortBy);
    }else{
        mongooseQuery = mongooseQuery.sort('-CreateAt');
    }


    //Field Limiting
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ');
        mongooseQuery = mongooseQuery.select(fields);
    }else{
        mongooseQuery = mongooseQuery.select('-v');
    }

    //Search
    if(req.query.keyword){
        const query = {};
        query.$or = [
            {title: {$regex: req.query.keyword, $options: 'i'}}
            ,{description: {$regex: req.query.keyword, $options: 'i'}}
        ]

        mongooseQuery = mongooseQuery.find(query);
    }



    //Execute Query
    const products = await mongooseQuery;
    res.status(200).json({ success: true, results: products.length, page, data: products });
});

/**
 * @desc    Get a single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 * @returns {Object} - The product object with the specified ID
 */
const getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ApiError(`No Product found for this ID: ${id}`, 404));
    }
    res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Update a product by ID
 * @route   PUT /api/v1/products/:id
 * @access  Private (Admin)
 * @returns {Object} - The updated product object
 */
const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.body.title) {
        // If title is provided, slugify it
        req.body.slug = slugify(req.body.title, { lower: true });
    }
    const product = await Product.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    );
    if (!product) {
        return next(new ApiError(`No Product found for this ID: ${id}`, 404));
    }
    res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Admin)
 * @returns {Object} - A success message
 */

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return next(new ApiError(`No Product found for this ID: ${id}`, 404));
    }
    res.status(204).json({ success: true, message: 'Product deleted successfully' });
});


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};