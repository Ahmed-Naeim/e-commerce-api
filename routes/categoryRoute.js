const express = require('express');
const router = express.Router();
const {getCategoriesValidator,
    getCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
    createCategoryValidator
} = require("../utils/validators/categoryValidator")
const { createCategory, 
    getCategories, 
    getCategory, 
    updateCategory, 
    deleteCategory
} = require('../services/categoryService');

/* Importing subCategoryRoute to handle sub-categories under a specific category
This allows us to modularize the routes and keep the code organized.
Nested routes are used to handle sub-categories that belong to a specific category.
The subCategoryRoute will handle all routes that start with /:categoryId/sub-categories
*/
const subCategoryRoute = require('./subCategoryRoute');
router.use('/:categoryId/subCategory', subCategoryRoute);

router.route('/')
    .post(createCategoryValidator, createCategory)
    .get(getCategoriesValidator, getCategories);

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;