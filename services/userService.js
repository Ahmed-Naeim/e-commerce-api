const User = require("../models/userModel.js");
const factory = require("./handlersFactory");
const asyncHandler = require("express-async-handler");


/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Private (Admin)
 * @returns {Object} - The created user object
 */
const createUser = factory.createOne(User);
/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private (Admin)
 * @returns {Object} - An object containing the users and pagination info
 * NOTE it accepts pagination parameters `page` and `limit` in the query string. like ?page=1&limit=5
 */
const getUsers = factory.getAll(User, "Users");

/**
 * @desc    Get a single user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private
 * @returns {Object} - The user object with the specified ID
 */
const getUser = factory.getOne(User);

/**
 * @desc    Update a user by ID
 * @route   PUT /api/v1/users/:id
 * @access  Private (Admin)
 * @returns {Object} - The updated product object
 */
const updateUser = asyncHandler(async (req, res, next) => {
        const doc = await User.findOneAndUpdate(
            req.params.id,
            {
                name: req.body.name,
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

const changeUserPassword = asyncHandler(async (req, res, next) => {
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

const deleteUser = factory.deleteOne(User)


module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    changeUserPassword
};