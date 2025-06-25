const Product = require('../models/productModel');
const factory = require('./handlersFactory')

const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');



exports.uploadProductImages = uploadMixOfImages([
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    // console.log(req.files);
    //1- Image processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverFileName}`);

        // Save image into our db
        req.body.imageCover = imageCoverFileName;
    }
    //2- Image processing for images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

            await sharp(img.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 95 })
                .toFile(`uploads/products/${imageName}`);

            // Save image into our db
            req.body.images.push(imageName);
            })
        );

    next();
    }
});

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private (Admin)
 * @returns {Object} - The created product object
 */
exports.createProduct = factory.createOne(Product);

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @access  Public
 * @returns {Object} - An object containing the products and pagination info
 * NOTE it accepts pagination parameters `page` and `limit` in the query string. like ?page=1&limit=5
 */
exports.getProducts = factory.getAll(Product, 'Products')

/**
 * @desc    Get a single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 * @returns {Object} - The product object with the specified ID
 */
exports.getProduct = factory.getOne(Product, 'reviews');

/**
 * @desc    Update a product by ID
 * @route   PUT /api/v1/products/:id
 * @access  Private (Admin)
 * @returns {Object} - The updated product object
 */
exports.updateProduct = factory.updateOne(Product);
/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Admin)
 * @returns {Object} - A success message
 */

exports.deleteProduct = factory.deleteOne(Product)
