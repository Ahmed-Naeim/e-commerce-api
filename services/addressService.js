const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require('../utils/apiError');


exports.addAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { addresses: req.body }
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Address added successfully",
        data: user.addresses
    });
    
});

exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('addresses');

    if (!user) {
        return next(new ApiError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: "User addresses retrieved successfully",
        result:user.addresses.length,
        data: user.addresses
    });
});

exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { addresses: req.params.addressId }
        },
        { new: true }
    );

    if (!user) {
        return next(new ApiError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: "Address removed successfully",
        data: user.addresses
    });
});
