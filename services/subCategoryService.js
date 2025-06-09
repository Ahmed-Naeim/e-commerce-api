const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const { default: slugify } = require('slugify');
const SubCategory = require('../models/subCategoryModel');


/**
 * @desc    Create a new SubCategory
 * @route   POST /api/v1/categories
 * @access  Private (admin)
 * @return  {Object} - the created sub category object
 */
exports.createSubCategory = asyncHandler(async (req, res) => {
    const {name, category} = req.body;
    await SubCategory.create({
        name,
        slug: slugify(name),
        category
    });
    res.status(201).json({success: true, message: "SubCategory is Created successfully"})
});


exports.getSubCategories = asyncHandler(async (req, res) => {
    const {page = 1, limit = 5} = req.query;
    const skip = (page -1 ) * limit;
    const subCategories = await SubCategory.find({category:req.params.categoryId}).skip(skip).limit(limit);
    // .populate({path: 'category', select: 'name - _id'});
    res.status(200).json({ success: true, results: subCategories.length, page, data: subCategories });
});

exports.getSubCategory = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    const subCategory = await SubCategory.findById(id);
    // .populate({path: 'category', select: 'name - _id'});
    if(!subCategory){
        return next(new ApiError(`No SubCategory with this id ${id}`));
    }
    res.status(200).json({success: true, data: subCategory});
});

exports.updateSubCategory = asyncHandler(async (req, res, next) =>{
    const {id} = req.params;
    const {name, category} = req.body;
    const subCategory = await SubCategory.findOneAndUpdate(
        {_id:id},
        {name, slug: slugify(name), category},
        {new: true}
    );
    // .populate({path: 'category', select: 'name'});
    if(!subCategory){
        return next(new ApiError(`No SubCategory with this id ${id}`));
    }
    res.status(200).json({success: true, data: subCategory});
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const subCategory = await SubCategory.findByIdAndDelete(id);
    if(!subCategory){
        return next(ApiError(`No SubCategory with this id ${id}`))
    }
    res.status(204).json();
});
