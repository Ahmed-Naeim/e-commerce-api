const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const { default: slugify } = require('slugify');
const ApiError = require('../utils/apiError');

/*
@desc    Create a new category
@route   POST /api/v1/categories
@access  Private (Admin)
@returns {Object} - The created category object
 */
exports.createCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;
    await Category.create({
        name,
        slug: slugify(name), // Create a slug from the name
        image: req.body.image // Assuming image is passed in the request body
    });
    res.status(201).json({ success: true, message: 'Category created successfully' });
});

/*
@desc    Get all categories
@route   GET /api/v1/categories
@access  Public
NOTE it accepts pagination parameters `page` and `limit` in the query string. like ?page=1&limit=5
@returns {Object} - An object containing the categories and pagination info
*/
exports.getCategories = asyncHandler(async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const categories = await Category.find({}).skip(skip).limit(limit);
    res.status(200).json({ success: true, results: categories.length, page, data: categories });
});


/*
@desc    Get a single category by ID
@route   GET /api/v1/categories/:id
@access  Public
@returns {Object} - The category object with the specified ID
*/
exports.getCategory = asyncHandler (async (req, res, next) => {
    const {id} = req.params;
    const category = await Category.findById(id);
    if(!category) {
        return next(new ApiError(`No Category for this ${id}`, 404))
    }
    res.status(200).json({ success: true, data: category });
});

/*
@desc    Update a category by ID
@route   PUT /api/v1/categories/:id
@access  Private (Admin)
@returns {Object} - The updated category object
*/
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {name} = req.body;
    const category = await Category.findOneAndUpdate(
        { _id: id },
        { name, slug: slugify(name) }, // Update the name and slug
        { new: true} // Return the updated document
    );
    if (!category) {
        return next(new ApiError(`No Category for this ${id}`, 404))
    }
    res.status(200).json({ success: true, data: category });
});


exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        return next(new ApiError(`No Category for this ${id}`, 404))
    }
    res.status(204).json();
});

