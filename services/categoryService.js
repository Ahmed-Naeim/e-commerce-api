const Category = require('../models/categoryModel');
const factory = require('./handlersFactory');


/*
@desc    Create a new category
@route   POST /api/v1/categories
@access  Private (Admin)
@returns {Object} - The created category object
 */
exports.createCategory = factory.createOne(Category);

/*
@desc    Get all categories
@route   GET /api/v1/categories
@access  Public
NOTE it accepts pagination parameters `page` and `limit` in the query string. like ?page=1&limit=5
@returns {Object} - An object containing the categories and pagination info
*/
exports.getCategories = factory.getAll(Category, 'Categories');


/*
@desc    Get a single category by ID
@route   GET /api/v1/categories/:id
@access  Public
@returns {Object} - The category object with the specified ID
*/
exports.getCategory = factory.getOne(Category);

/*
@desc    Update a category by ID
@route   PUT /api/v1/categories/:id
@access  Private (Admin)
@returns {Object} - The updated category object
*/
exports.updateCategory = factory.updateOne(Category);

/**
 * @desc    Delete a category by ID
 * @route   DELETE /api/v1/categories/:id
 * @access  Private (Admin)
 * @returns {Object} - A success message
 */
exports.deleteCategory = factory.deleteOne(Category);

