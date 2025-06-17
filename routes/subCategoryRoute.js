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

router.route('/')
    .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
    .get(createFilterObj, getSubCategories);

router.route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;