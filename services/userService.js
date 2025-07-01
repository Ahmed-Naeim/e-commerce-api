const User = require("../models/userModel.js");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");

const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');
const createToken = require('../utils/createToken');

// Upload single image
exports.uploadUserImage = uploadSingleImage('profileImg');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
    }

    next();
});

/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Private (Admin)
 * @returns {Object} - The created user object
 */
exports.createUser = factory.createOne(User);

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private (Admin)
 * @returns {Object} - An object containing the users and pagination info
 * NOTE it accepts pagination parameters `page` and `limit` in the query string. like ?page=1&limit=5
 */
exports.getUsers = factory.getAll(User, "Users");

/**
 * @desc    Get a single user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private
 * @returns {Object} - The user object with the specified ID
 */
exports.getUser = factory.getOne(User);

/**
 * @desc    Update a user by ID
 * @route   PUT /api/v1/users/:id
 * @access  Private (Admin)
 * @returns {Object} - The updated product object
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
        const doc = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                slug: req.body.slug,
                email: req.body.email,
                phone: req.body.phone,
                profileImg: req.body.profileImg,
                role: req.body.role
            },
            { new: true }
        );
        if (!doc) {
            return next(new ApiError(`No document found for this ID: ${id}`, 404));
        }
        res.status(200).json({ success: true, data: doc });
    });

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const doc = await User.findOneAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now()
        },
        { new: true }
    );
    if (!doc) {
        return next(new ApiError(`No document found for this ID: ${id}`, 404));
    }
    res.status(200).json({ success: true, data: doc });
});


/**
 * @desc    Delete a user by ID
 * @route   DELETE /api/v1/users/:id
 * @access  Private (Admin)
 * @returns {Object} - A success message
 */
exports.deleteUser = factory.deleteOne(User);

/*
 * @desc    Middleware to get the logged-in user's data
 * @route   GET /api/v1/users/getMe
 * @access  Private
 * @returns {Object} - The logged-in user's data
 */
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user.id; // Set the ID to the logged-in user's ID
    next(); // Call the next middleware to handle the request
});

/**
 * @desc    Change the logged-in user's password
 * @route   PUT /api/v1/users/change-my-password
 * @access  Private
 * @returns {Object} - The updated user object and a new token
 */
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const doc = await User.findOneAndUpdate(
        req.user.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now()
        },
        { new: true }
    );
    if (!doc) {
        return next(new ApiError(`No document found for this ID: ${req.user.id}`, 404));
    }

    //generate token
    const token = createToken(doc._id);

    res.status(200).json({ success: true, data: doc, token });
});

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            phone: req.body.phone,
        },
        { new: true }
    );
    if (!doc) {
        return next(new ApiError(`No document found for this ID: ${req.user.id}`, 404));
    }
    res.status(200).json({ success: true, data: doc });
});

exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(
        req.user.id,
        { active: false },
        { new: true }
    );
    if (!doc) {
        return next(new ApiError(`No document found for this ID: ${req.user.id}`, 404));
    }
    res.status(200).json({ success: true, data: doc });
});