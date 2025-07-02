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
    deleteCategory,
    uploadCategoryImage,
    resizeImage
} = require('../services/categoryService');
const authService = require('../services/authService');


/* Importing subCategoryRoute to handle sub-categories under a specific category
This allows us to modularize the routes and keep the code organized.
Nested routes are used to handle sub-categories that belong to a specific category.
The subCategoryRoute will handle all routes that start with /:categoryId/sub-categories
*/
const subCategoryRoute = require('./subCategoryRoute');
router.use('/:categoryId/subCategories', subCategoryRoute);

router.route('/')
    .post(    
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadCategoryImage,
        resizeImage,
        createCategoryValidator,
        createCategory)
    .get(getCategoriesValidator, getCategories);

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(    
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        uploadCategoryImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory)
    .delete(    
        authService.protect,
        authService.allowedTo('admin'),
        deleteCategoryValidator,
        deleteCategory);

module.exports = router;