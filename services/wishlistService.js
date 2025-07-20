const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require('../utils/apiError');


exports.addToWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { wishlist: req.body.productId }
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Product added to wishlist successfully",
        data: user.wishlist
    });
    
});

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (!user) {
        return next(new ApiError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: "User wishlist retrieved successfully",
        result:user.wishlist.length,
        data: user.wishlist
    });
});

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { wishlist: req.params.productId }
        },
        { new: true }
    );

    if (!user) {
        return next(new ApiError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: "Product removed from wishlist successfully",
        data: user.wishlist
    });
});
