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
    deleteBrand
} = require('../services/brandService');

router.route('/')
    .post(createBrandValidator, createBrand)
    .get(getBrandsValidator, getBrands);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);

module.exports = router;