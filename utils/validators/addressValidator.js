const {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const ApiError = require('../apiError');
const User = require('../../models/userModel');

exports.addAddressValidator = [
    check('details')
        .notEmpty()
        .withMessage('Address details are required'),
    check('city')
        .notEmpty()
        .withMessage('City is required'),
    check('alias')
        .notEmpty()
        .withMessage('Alias is required')
        .isLength({max: 50})
        .withMessage('Alias must be less than 50 characters')
        .custom(async (value, {req}) => {
            const user = await User.findById(req.user._id);
            if (user.addresses.some(address => address.alias === value)) {
                throw new ApiError('Alias must be unique', 400);
            }
        }),
    check('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone('any')
        .withMessage('Invalid phone number format'),
    check('postalCode')
        .notEmpty()
        .withMessage('Postal code is required')
        .isPostalCode('any')
        .withMessage('Invalid postal code format'),
];

exports.getLoggedUserAddressesValidator = [
    check('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid User ID format')
        .custom(async (value, {req}) => {
            const user = await User.findById(value);
            if (!user) {
                throw new ApiError('User not found', 404);
            }
        })
];

exports.removeAddressValidator = [
    check('addressId')
        .notEmpty()
        .withMessage('Address ID is required')
        .isMongoId()
        .withMessage('Invalid Address ID format')
        .custom(async (value, {req}) => {
            const user = await User.findById(req.user._id);
            if (!user || !user.addresses.includes(value)) {
                throw new ApiError('Address not found in user addresses', 404);
            }
        })
];