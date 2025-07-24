const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler');


const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * @desc Add a product to the cart
 * @route POST /api/v1/carts
 * @access Private (User)
 */
exports.addToCart = asyncHandler(async (req, res, next) => {

    //check the product is in the database
    const product = await Product.findById(req.body.productId);
    if (!product) {
        return next(new ApiError('Product not found', 404));
    }

    //check if the logged user has a cart.
    let cart = await Cart.findOne({ user: req.user._id });
    
    //create a new cart if not exists
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, cartItems: [{ product: req.body.productId, quantity: req.body.quantity, color: req.body.color, price: product.price }] });
    }
    else{
        //if cart exists, check if the product is already in the cart
        const productIndex = cart.cartItems.findIndex(item => item.product.toString() === req.body.productId && item.color === req.body.color);
        if (productIndex === -1) {
            cart.cartItems.push({ product: req.body.productId, quantity: req.body.quantity, color: req.body.color, price: product.price });
        }else{
            cart.cartItems[productIndex].quantity += req.body.quantity;
        }
    }
    //calculate total price
    cart.totalCartPrice = calculateTotalPrice(cart.cartItems);
    cart.totalPriceAfterDiscount = cart.totalCartPrice; // Assuming no discounts for now

    //save the cart
    await cart.save();

    res.status(200).json({ status: 'success', data: cart });
});


/**
 * @desc Get the logged user's cart
 * @route GET /api/v1/carts
 * @access Private (User)
 */
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    //check if the user has a cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }

    res.status(200).json({ status: 'success', data: cart });
});

/**
 * @desc Clear the logged user's cart
 * @route DELETE /api/v1/carts
 * @access Private (User)
 */
exports.clearCart = asyncHandler(async (req, res, next) => {
    //check if the user has a cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }

    //clear the cart
    cart.cartItems = [];
    cart.totalCartPrice = 0;
    cart.totalPriceAfterDiscount = 0;

    //save the cart
    await cart.save();

    res.status(200).json({ status: 'success', data: cart });
});

/**
 * @desc Delete an item from the cart
 * @route DELETE /api/v1/carts/:itemId
 * @access Private (User)
 */
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
    //check if the user has a cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }

    //check if the item exists in the cart
    const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
        return next(new ApiError('Cart item not found', 404));
    }

    //if the quantity is greater than 1, reduce the quantity
    if (cart.cartItems[itemIndex].quantity > 1) {
        cart.cartItems[itemIndex].quantity -= 1;
    } else {
        //if the quantity is 1, remove the item from the cart
        cart.cartItems.splice(itemIndex, 1);
    }


    //recalculate the total price
    cart.totalCartPrice = calculateTotalPrice(cart.cartItems);
    cart.totalPriceAfterDiscount = cart.totalCartPrice; // Assuming no discounts for now

    //save the cart
    await cart.save();

    res.status(200).json({ status: 'success', data: cart });
});

/**
 * @desc Update the quantity of an item in the cart
 * @route PATCH /api/v1/carts/:itemId
 * @access Private (User)
 */
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    //check if the user has a cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }

    //check if the item exists in the cart
    const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
        return next(new ApiError('Cart item not found', 404));
    }

    //update the quantity
    cart.cartItems[itemIndex].quantity = req.body.quantity;

    //recalculate the total price
    cart.totalCartPrice = calculateTotalPrice(cart.cartItems);
    cart.totalPriceAfterDiscount = cart.totalCartPrice; // Assuming no discounts for now

    //save the cart
    await cart.save();

    res.status(200).json({ status: 'success', data: cart });
});

/**
 * @desc Apply a coupon to the cart
 * @route POST /api/v1/carts/apply-coupon
 * @access Private (User)
 * @body { code: 'COUPON_CODE' }
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    //check if the user has a cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError('Cart not found', 404));
    }

    //check if the coupon exists
    const coupon = await Coupon.findOne({ name: req.body.code });

    if (!coupon) {
        return next(new ApiError('Coupon not found', 404));
    }

    //check if the coupon is valid
    if (coupon.expiryDate < Date.now()) {
        return next(new ApiError('Coupon has expired', 400));
    }

    //apply the coupon discount
    cart.totalPriceAfterDiscount = cart.totalCartPrice - (cart.totalCartPrice * (coupon.discount / 100));

    //save the cart
    await cart.save();

    res.status(200).json({ status: 'success', data: cart });

});
