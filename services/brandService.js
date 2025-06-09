const Brand = require('../models/brandModel');
const { default: slugify } = require('slugify');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const brand = await Brand.create({
        name,
        slug: slugify(name), // Create a slug from the name
        image: req.body.image // Assuming image is passed in the request body
    });
    res.status(201).json({ success: true, message: 'Brand created successfully', data: brand });
});

const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    res.status(200).json({ success: true, data: brands });
});

const getBrand = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        return next(new ApiError('Brand not found', 404));
    }
    res.status(200).json({ success: true, data: brand });
});

const updateBrand = asyncHandler(async (req, res, next) => {
    const { name, image } = req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.id, {
        name,
        slug: slugify(name),
        image
    }, { new: true });
    if (!brand) {
        return next(new ApiError('Brand not found', 404));
    }
    res.status(200).json({ success: true, message: 'Brand updated successfully', data: brand });
});

const deleteBrand = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
        return next(new ApiError('Brand not found', 404));
    }
    res.status(204).json({ success: true, message: 'Brand deleted successfully' });
});

module.exports = {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
};