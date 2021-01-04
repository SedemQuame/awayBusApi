//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { now } = require('lodash');

// ==================================== sub-document schemas ==========================================//
const discountType = new mongoose.Schema({
    type: { type: String },
    value: { type: Number },
});

const useType = new mongoose.Schema({
    type: { type: String },
});

const dates = new mongoose.Schema({
    dateCreated: { type: Date, default: now },
    expiryDate: { type: String },
});

// ==================================== document schema=======================================//
const couponSchema = new mongoose.Schema({
    generatedCode: { type: String },
    discountType: discountType,
    useType: useType,
    applicableRoutes: { type: String },
    dates: dates,
});

couponSchema.plugin(passportLocalMongoose);

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('coupons', couponSchema);