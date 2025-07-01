const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');


const createToken = require('../utils/createToken');

exports.signup = asyncHandler(async(req, res, next)=>{
    //create user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    //generate a unique token
    const token = createToken(user._id);

    //send response
    res.status(201).json({data:user, token})
});

exports.login = asyncHandler(async(req, res, next)=>{
    //check if email and password are valid
    const user = await User.findOne({email: req.body.email});
    if(!user || !(await bcrypt.compare(req.body.password, user.password))){
        return next(new ApiError("The email or password are not valid", 401));
    }

    //generate jwt
    const token = createToken(user._id);

    //send response
    res.status(200).json({data:user, token});
});

// @desc    Protect routes
// @access  Private
// @returns {Object} - The current user object
// Make sure to use this middleware before any protected route
exports.protect = asyncHandler(async(req, res, next)=>{

    let token;
    //check if the token exists
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token)
        return next(new ApiError("Please login", 401));

    //verify the token (no change happens or expired token)
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decoded)
        return next(new ApiError("Please login", 401));

    //check if the user is existed
    const currentUser = await User.findById(decoded.userId);

    if(!currentUser)
        return next(new ApiError("User is not found", 401));

    //check if the user change the password after the token created
    let passwordChangedAtTimeStamp;
    if(currentUser.passwordChangedAt){
        const passwordChangedAtTimeStamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    }
    if(passwordChangedAtTimeStamp > decoded.iat)
        return next(new ApiError("User recently changed his password, please login again", 401))


    req.user = currentUser;
    next();
})

// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        // 1) access roles
        // 2) access registered user (req.user.role)
        if (!roles.includes(req.user.role)) {
            return next(
            new ApiError('You are not allowed to access this route', 403)
            );
        }
        next();
    });

// @desc    Forgot Password
// @access  Public
exports.forgotPassword = asyncHandler(async(req, res, next)=>{
    //1) get user by email
    const user = await User.findOne({email: req.body.email});

    if(!user)
        return next(new ApiError("There is no user with this email", 404));

    //2) generate reset token and save the hashed token in the database
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenHash = require('crypto')
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    user.passwordResetCode = resetTokenHash;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000

    await user.save();

    //3) send the reset token to the user email
    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Token",
            message: `Hello ${user.name}!!\nYour password reset token is: ${resetToken}\nPlease use it within the next 10 minutes.\nIf you didn't request this, please ignore this email.\nE-commerce App Team`
        });
    }
    catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        console.error('Nodemailer error:', error);
        return next(new ApiError("There is an error in sending the email, please try again later", 500));
    }

    res.status(200).json({
        status: "success",
        message: "Reset token sent to your email"
    });
});

// @desc    Verify the reset code
// @access  Public
exports.verifyResetCode = asyncHandler(async(req, res, next)=>{
    //get the user based on the reset code
    const user = await User.findOne({
        passwordResetCode: require('crypto')
            .createHash('sha256')
            .update(req.body.resetCode)
            .digest('hex'),
        passwordResetExpires: {$gt: Date.now()}
    });

    if(!user)
        return next(new ApiError("Reset code is invalid or expired", 400)); //400 Bad Request

    //make the passwordResetVerified true and save the changes to user
    user.passwordResetVerified = true;
    await user.save();

    //send response
    res.status(200).json({
        status: "success",
        message: "Reset code verified successfully"
    });
});


// @desc    Reset Password
// @access  Public
exports.resetPassword = asyncHandler(async(req, res, next)=>{
    //get the user based on the email
    const user = await User.findOne({email: req.body.email});
    if(!user)
        return next(new ApiError("There is no user with this email", 404));

    //check if the passwordResetVerified is true
    if(!user.passwordResetVerified)
        return next(new ApiError("Please verify your reset code first", 400)); //400 Bad Request

    //set the new password to the user and give the passwordResetCode, passwordResetExpires and passwordResetVerified undefined
    user.password = req.body.newPassword;

    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = false;

    //save the user changes
    await user.save();

    //generate a new token
    const token = createToken(user._id);

    //send response
    res.status(200).json({
        status: "success",
        message: "Password reset successfully",
        token
    });
});

