const express = require('express');
const router = express.Router();
const {
    getBrandsValidator,
    getBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
    createBrandValidator
} = require("../utils/validators/brandValidator");

const {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImage
} = require('../services/brandService');

const authService = require('../services/authService');


router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadBrandImage,
        resizeImage,
        createBrandValidator,
        createBrand)
    .get(getBrandsValidator, getBrands);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadBrandImage,
        resizeImage,
        updateBrandValidator,
        updateBrand)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteBrandValidator,
        deleteBrand);

module.exports = router;