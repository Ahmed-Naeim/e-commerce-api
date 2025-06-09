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
    deleteSubCategory
} = require('../services/subCategoryService');

router.route('/')
    .post(createSubCategoryValidator, createSubCategory)
    .get(getSubCategories);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;