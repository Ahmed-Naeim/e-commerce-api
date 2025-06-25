const express = require('express');
const router = express.Router({mergeParams: true}); // Allows us to access params from parent route
const {getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
    createSubCategoryValidator
} = require("../utils/validators/subCategoryValidator");

const { createSubCategory, 
    getSubCategories, 
    getSubCategory, 
    updateSubCategory, 
    deleteSubCategory,
    createFilterObj,
    setCategoryIdToBody
} = require('../services/subCategoryService');

const authService = require('../services/authService');

router.route('/')
    .post(    
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        setCategoryIdToBody,
        createSubCategoryValidator,
        createSubCategory, createSubCategory)
    .get(createFilterObj, getSubCategories);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(    
        authService.protect,
        authService.allowedTo('admin', 'manager'),
        updateSubCategoryValidator,
        updateSubCategory)
    .delete(
        authService.protect,
        authService.allowedTo('admin'),
        deleteSubCategoryValidator,
        deleteSubCategory);

module.exports = router;