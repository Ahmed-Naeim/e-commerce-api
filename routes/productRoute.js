const express = require('express');
const router = express.Router();
const { getProductsValidator, getProductValidator, createProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validators/productValidator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, uploadProductImages, resizeProductImages } = require('../services/productService');
const authService = require('../services/authService');


router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadProductImages,
        resizeProductImages, 
        createProductValidator,
        createProduct)
    .get(getProductsValidator, getProducts);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadProductImages,
        resizeProductImages,
        updateProductValidator,
        updateProduct)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteProductValidator,
        deleteProduct);

module.exports = router;
