const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand name is required'],
        unique: [true, 'Brand name must be unique'],
        minlength: [2, 'Brand name must be at least 3 characters long'],
        maxlength: [50, 'Brand name must not exceed 50 characters']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: {
        type: String
    }
}, { timestamps: true });   

const BrandModel = mongoose.model('Brand', brandSchema);

module.exports = BrandModel;