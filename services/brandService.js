const Brand = require('../models/brandModel');
const factory = require('./handlersFactory');

const createBrand = factory.createOne(Brand);

const getBrands = factory.getAll(Brand, 'Brands');

const getBrand = factory.getOne(Brand);

const updateBrand = factory.updateOne(Brand);

const deleteBrand = factory.deleteOne(Brand);

module.exports = {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
};