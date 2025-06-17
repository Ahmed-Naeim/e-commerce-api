const SubCategory = require('../models/subCategoryModel');
const factory = require('./handlersFactory');



exports.setCategoryIdToBody = (req, res, next) => {
    // Nested route
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = {category: req.params.categoryId};
    req.filterObj = filterObject;
    next();
};


/**
 * @desc    Create a new SubCategory
 * @route   POST /api/v1/categories
 * @access  Private (admin)
 * @return  {Object} - the created sub category object
 */
exports.createSubCategory = factory.createOne(SubCategory);


// @desc    Get list of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory, 'SubCategories');

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc    Update specific subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete specific subCategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
