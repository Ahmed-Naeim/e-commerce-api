const Brand = require('../models/brandModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');


// Upload single image
exports.uploadBrandImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/brands/${filename}`);

    // Save image into our db 
    req.body.image = filename;

    next();
});

exports.createBrand = factory.createOne(Brand);

exports.getBrands = factory.getAll(Brand, 'Brands');

exports.getBrand = factory.getOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);