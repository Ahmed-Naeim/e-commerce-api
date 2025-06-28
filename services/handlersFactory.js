const slugify = require('slugify');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures')

exports.deleteOne = (Model)=>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const doc = await Model.findByIdAndDelete(id);
        if (!doc) {
            return next(new ApiError(`No document found for this ID: ${id}`, 404));
        }
        res.status(204).json({ success: true, message: 'Product deleted successfully' });
    });

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const doc = await Model.findOneAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!doc) {
            return next(new ApiError(`No document found for this ID: ${id}`, 404));
        }
        res.status(200).json({ success: true, data: doc });
    });

exports.createOne = (Model)=>
    asyncHandler(async (req, res) => {
        const doc = await Model.create(req.body);
        res.status(201).json({ success: true, data: doc });
    });

exports.getOne = (Model, populationOpt)=>
    asyncHandler(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populationOpt) {
            query = query.populate(populationOpt);
        }

        const doc = await query;

        if (!doc) {
            return next(new ApiError(`No document found for this ID: ${id}`, 404));
        }
        res.status(200).json({ success: true, data: doc });
    });

exports.getAll = (Model, modelName = '') =>
    asyncHandler(async (req, res) => {
    
        let filter = {};
        if (req.filterObj) {
            filter = req.filterObj;
        }
        //Build Query
        const documentCounts = await Model.countDocuments();
        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
        .paginate(documentCounts)
        .filter()
        .search(modelName)
        .limitFields()
        .sort()
    
        //Execute Query
        const { mongooseQuery, paginationResult} = apiFeatures; //destructure to use them without apiFeatures.something
        const docs = await mongooseQuery;
    
        res.status(200).json({ success: true, results: docs.length, paginationResult, data: docs });
    });