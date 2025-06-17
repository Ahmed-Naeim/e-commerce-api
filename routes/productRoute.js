const express = require('express');
const router = express.Router();
const { getProductsValidator, getProductValidator, createProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validators/productValidator');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../services/productService');

router.route('/')
    .post(createProductValidator, createProduct)
    .get(getProductsValidator, getProducts);

router.route('/:id')
    .get(getProductValidator, getProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;
