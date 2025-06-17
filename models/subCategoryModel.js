const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'SubCategory name is required'],
        unique: [true, 'SubCategory name needs to be unique'],
        minlength: [2, 'SubCategory name need to be 2 or more'],
        maxlength: [32, 'SubCategory name need to be 32 or less']
    },
    slug:{
        type: String,
        lowercase: true
    },
    category:{
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: [true, "SubCategory needs to belong to a category"]
    }
}, {timestamps: true}
);

subCategorySchema.pre(/^find/, function (next) { //to populate category name
	this.populate ({
		path: 'category',
		select: 'name'
});
next();
});

const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategoryModel;