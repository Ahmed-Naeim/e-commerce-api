const slugify = require('slugify');
const {check} = require("express-validator");
const User = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const bcrypt = require("bcryptjs");

const createUserValidator = [
    check('name')
        .notEmpty().withMessage("The name is required")
        .isLength({min:3 , max:32}).withMessage("The name length must be between 3 and 32")
        .custom((val, {req})=>{
            if (typeof val !== 'string') throw new Error('Name must be a string');
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .notEmpty().withMessage("The email is required")
        .isEmail().withMessage("The email must be valid")
        .custom(async(val) =>{
            const email = await User.findOne({email: val});
            if(email){
                throw new Error("the email is already exists")
            }
        }),
    check('password')
        .notEmpty().withMessage("The password is required")
        .isLength({min: 6}).withMessage("The password needs to be more than 6 characters")
        .custom((password, {req}) =>{
            if(password !== req.body.passwordConfirm){
                throw new Error("The password confirmation not match the new password")
            }
            return true;
        }),
    check('passwordConfirm')
        .notEmpty().withMessage("the password confirmation is needed"),
    check('phone')
        .optional()
        .isMobilePhone(['ar-EG','ar-SA']).withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),
    check('profileImg')
        .optional(),
    check('role')
        .optional(),
    
    validatorMiddleware,
];

const getUserValidator = [
    check('id').isMongoId().withMessage("Invalid User ID"),

    validatorMiddleware,
];

const updateUserValidator = [

    check('name')
        .notEmpty().withMessage("The name is required")
        .isLength({min:3 , max:32}).withMessage("The name length must be between 3 and 32")
        .custom((val, {req})=>{
        req.body.slug = slugify(val);
        return true

        }),
    check('email')
        .notEmpty().withMessage("The email is required")
        .isEmail().withMessage("The email must be valid")
        .custom(async(val) =>{
            const email = await User.findOne({email: val});
            if(email){
                throw new Error("the email is already exists")
            }
        }),
    check('phone')
        .optional()
        .isMobilePhone(['ar-EG','ar-SA']).withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),
    check('profileImg')
        .optional(),
    check('role')
        .optional(),

    validatorMiddleware,
]

const changeUserPasswordValidator = [
    check('id').isMongoId().withMessage("Invalid User ID"),
    check('password')
        .notEmpty().withMessage("The password is required")
        .isLength({min: 6}).withMessage("The password needs to be more than 6 characters")
        .custom(async (password, {req}) => {
            //verify the current password
            const user = User.findById(req.params.id);
            if (!user) {
                throw new Error("User not found");
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error("The current password is incorrect");
            }
            // Check if the new password matches the confirmation
            if (passwordConfirm !== req.body.password) {
                throw new Error("The password confirmation does not match the new password");
            }
            return true;
        }),

    validatorMiddleware
];


const deleteUserValidator = [
    check('id').isMongoId().withMessage("Invalid User ID"),
    validatorMiddleware
];

module.exports = {
    createUserValidator,
    getUserValidator,
    updateUserValidator,
    changeUserPasswordValidator,
    deleteUserValidator
};
