const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const factory = require('./handlersFactory');
const sendEmail = require('../utils/sendEmail');


/**
 * @desc    Filter orders for logged in user
 */
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if(req.user.role === 'user') {
        req.filterObj = { user: req.user._id };
    }
});


/**
 * @desc    Create a new order with COD payment method
 * @route   POST /api/v1/orders/cash-order
 * @access  Private "User"
 */
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const session = await Order.startSession();
    session.startTransaction();

    try {
        // Get cart for the user
        const cart = await Cart.findById(req.params.cartId).populate('cartItems.product').session(session);

        if (!cart || cart.cartItems.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return next(new ApiError('Cart is empty', 400));
        }

        // Calculate total order price
        const cartPrice = cart.totalPriceAfterDiscount
            ? cart.totalPriceAfterDiscount
            : cart.totalCartPrice;
        if (cartPrice < 0) {
            await session.abortTransaction();
            session.endSession();
            return next(new ApiError('Total order price must be greater than zero', 400));
        }

        // Create the order
        const order = await Order.create([{
            user: req.user._id,
            cartItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            totalOrderPrice: cartPrice,
            paymentMethodType: 'COD'
        }], { session });

        // Update product stock and sold count
        const bulkOption = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { stock: -item.quantity, sold: +item.quantity } }
            }
        }));
        await Product.bulkWrite(bulkOption, { session });

        // Clear the cart
        await Cart.findOneAndDelete({ user: req.user._id }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Send confirmation email (outside transaction)
        const emailOptions = {
            email: req.user.email,
            subject: 'Order Confirmation',
            message: `Your order has been placed successfully. Order ID: ${order[0]._id}, Total Price: ${totalOrderPrice}`
        };
        await sendEmail(emailOptions);

        res.status(201).json({
            success: true,
            data: order[0]
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
});

/**
 * @desc    Get all orders for admin
 * @route   GET /api/v1/orders
 * @access  Private "Admin - Manager" or "User" with filter
 */
exports.findAllOrders = factory.getAll(Order, "Orders");

/**
 * @desc    Get specific order by id
 * @route   GET /api/v1/orders/:id
 * @access  Private "Admin - Manager" or "User" with filter
 */
exports.findSpecificOrder = factory.getOne(Order);

/**
 * @desc    Update specific order to paid
 * @route   PUT /api/v1/orders/:id/pay
 * @access  Private "Admin - Manager"
 */
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`No order found for this ID: ${req.params.id}`, 404));
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    await order.save();

    res.status(200).json({ success: true, data: order });
});


/**
 * @desc    Update specific order to delivered
 * @route   PUT /api/v1/orders/:id/deliver
 * @access  Private "Admin - Manager"
 */
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`No order found for this ID: ${req.params.id}`, 404));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({ success: true, data: order });
});



// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
// app settings
const taxPrice = 0;
const shippingPrice = 0;

// 1) Get cart depend on cartId
const cart = await Cart.findById(req.params.cartId);
if (!cart) {
    return next(
    new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
}

// 2) Get order price depend on cart price "Check if coupon apply"
const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

// 3) Create stripe checkout session
const session = await stripe.checkout.sessions.create({
    line_items: [
    {
        name: req.user.name,
        amount: totalOrderPrice * 100,
        currency: 'egp',
        quantity: 1,
    },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
});

// 4) send session to response
res.status(200).json({ status: 'success', session });
});

const createCardOrder = async (session) => {
const cartId = session.client_reference_id;
const shippingAddress = session.metadata;
const orderPrice = session.amount_total / 100;

const cart = await Cart.findById(cartId);
const user = await User.findOne({ email: session.customer_email });

// 3) Create order with default paymentMethodType card
const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
});

// 4) After creating order, decrement product quantity, increment product sold
if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
}
};


// // @desc    This webhook will run when stripe payment success paid
// // @route   POST /webhook-checkout
// // @access  Protected/User
// exports.webhookCheckout = asyncHandler(async (req, res, next) => {
// const sig = req.headers['stripe-signature'];

// let event;

// try {
//     event = stripe.webhooks.constructEvent(
//     req.body,
//     sig,
//     process.env.STRIPE_WEBHOOK_SECRET
//     );
// } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
// }
// if (event.type === 'checkout.session.completed') {
//     //  Create order
//     createCardOrder(event.data.object);
// }

// res.status(200).json({ received: true });
// });
