const Product = require('../models/productModel');
const factory = require('./handlersFactory')

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private (Admin)
 * @returns {Object} - The created product object
 */
const createProduct = factory.createOne(Product);

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @access  Public
 * @returns {Object} - An object containing the products and pagination info
 * NOTE it accepts pagination parameters `page` and `limit` in the query string. like ?page=1&limit=5
 */
const getProducts = factory.getAll(Product, 'Products')

/**
 * @desc    Get a single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 * @returns {Object} - The product object with the specified ID
 */
const getProduct = factory.getOne(Product, 'reviews');

/**
 * @desc    Update a product by ID
 * @route   PUT /api/v1/products/:id
 * @access  Private (Admin)
 * @returns {Object} - The updated product object
 */
const updateProduct = factory.updateOne(Product);
/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Admin)
 * @returns {Object} - A success message
 */

const deleteProduct = factory.deleteOne(Product)


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};