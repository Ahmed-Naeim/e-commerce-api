const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (payload)=>jwt.sign({userId: payload},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE_TIME})

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
        return next(ApiError("The email or password are not valid", 401));
    }

    //generate jwt
    const token = createToken(user._id);

    //send response
    res.status(200).json({data:user, token});
});

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
        return new ApiError("User is not found", 401);

    //check if the user change the password after the token created
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