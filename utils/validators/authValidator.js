const {check} = require("express-validator");
const User = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require('slugify');


exports.signupValidator = [
    check('name')
    .notEmpty()
    .withMessage('User required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),

    check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
        User.findOne({ email: val }).then((user) => {
        if (user) {
            return Promise.reject(new Error('E-mail already in user'));
        }
        })
    ),

    check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
        if (password !== req.body.passwordConfirm) {
            throw new Error('Password Confirmation incorrect');
        }
        return true;
    }),

    check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

    validatorMiddleware,
];

exports.loginValidator = [
    check('email')
        .notEmpty().withMessage("Need Email to login")
        .isEmail().withMessage("Invalid Email"),
    check('password')
        .notEmpty().withMessage("Need Password to login")
        .isLength({min:6}).withMessage("The password is too short"),
    validatorMiddleware
];

