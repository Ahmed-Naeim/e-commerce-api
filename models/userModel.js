const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: [true, "the name is required"],
        minlength: [3, "The username needs to be more than 3 characters"],
        maxlength: [32, "The username needs to be less than 32 characters"]
    },
    slug:{
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "The email is required"],
        unique: [true, "The email must be unique"],
        lowercase: true
    },
    phone: {
        type: String
    },
    profileImg:{
        type: String
    },
    password: {
        type: String,
        required: [true, "The password is required"],
        minlength: [6, "the password needs to be more than 6 characters or digits"]
    },
    passwordChangedAt: Date,
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    active: {
        type: Boolean,
        default: true
    }

}, {timestamps: true});

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
