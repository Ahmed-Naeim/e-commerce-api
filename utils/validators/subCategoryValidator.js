const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid SubCategoryId")
    , validatorMiddleware,
];

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid SubCategory Id")
    , validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid SubCategory Id")
    , validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage("SubCategory Name Required")
    .isLength({min: 2})
    .withMessage("Category Name must be more than 2")
    .isLength({max: 32})
    .withMessage("Category Name must be less than 32"),
    check('category')
    .isMongoId()
    .withMessage("Category Id is not valid"),
    validatorMiddleware,
];
