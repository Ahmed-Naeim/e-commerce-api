const slugify = require('slugify');
const { check } = require("express-validator");
const Product = require("../../models/productModel");
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


const createProductValidator = [
    check("title")
        .notEmpty()
        .withMessage("Product title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Product title must be between 3 and 100 characters long")
        .custom((val, {req}) =>{ //don’t forget to import body with check or do it with check will be fine
        req.body.slug = slugify(val);
        return true;
    })
    ,
    check("description")
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ min: 10, max: 500 })
        .withMessage("Product description must be between 10 and 500 characters long"),
    check("colors")
        .optional()
        .isArray()
        .withMessage("Colors must be an array of strings"),
    check("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isNumeric()
        .withMessage("Product price must be a number")
        .toFloat()
        .custom((value,{req}) => {
            if(value < 0) {
                return Promise(new Error("Product price must be a positive number"));
            }
        })
        .withMessage("Product price must be a positive number"),
    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("Price after discount must be a number")
        .toFloat()
        .custom((value,{req}) => {
            if(value < 0) {
                return Promise (new Error("Price after discount must be a positive number"));
            }
            if(value >= req.body.price) {
                return Promise (new Error("Price after discount must be less than the original price"));
            }
        })
        .withMessage("Price after discount must be a positive number"),
    check("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Product quantity must be a number")
        .custom((value, {req}) => {
            if(value < 0) {
                return Promise(new Error("Product quantity must be a positive number"));
            }
        })
        .withMessage("Product quantity must be a positive number"),
    check("sold")
        .optional()
        .isNumeric()
        .withMessage("Sold quantity must be a number")
        .custom((value, {req}) => {
            if(value < 0) {
                return Promise.reject( new Error("Sold quantity must be a positive number or zero"));
            }
        })
        .withMessage("Sold quantity must be a positive number"),
    check("imageCover")
        .notEmpty()
        .withMessage("Product cover image is required"),
    check("images")
        .optional()
        .isArray({ min: 1 })
        .withMessage("At least one image is required"),
    check("category")
        .notEmpty()
        .withMessage("Product category is required")
        .custom(async (value) => {
            const categoryExists = await Product.findById(value);
            if (!categoryExists) {
                throw new Error("Category does not exist");
            }
        }),
    check("subCategory")
        .optional()
        .custom(async (value) => {
            if (value) {
                const subCategoryExists = await Product.findById(value);
                if (!subCategoryExists) {
                    throw new Error("Sub-category does not exist"); 
                }
            }
        })
        .custom(async(val, {req}) =>{
            const subCategoriesIdsInDB = await SubCategory.find({category: req.body.category});

            subCategories.map(subCategory => subCategory._id.toString());
            const checker = (target, arr)=> target.every((v)=> arr.includes(v));
            if(!checker(val, subCategoriesIdsInDB)){
                throw new Error(`Sub Categories is not belong to this category`);
            }
        }),
        validatorMiddleware,
    
];

const getProductValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid product ID format"),
        validatorMiddleware,
];

const getProductsValidator = [
    check("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    check("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
        validatorMiddleware,
];

const updateProductValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid product ID format"),
    check('title')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

const deleteProductValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid product ID format"),
        validatorMiddleware,
];

module.exports = {
    createProductValidator,
    getProductValidator,
    getProductsValidator,
    updateProductValidator,
    deleteProductValidator
};