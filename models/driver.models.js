//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// ==================================== sub-document schemas ==========================================//
const notificationSchema = new mongoose.Schema({
    notificationDate: {type: Date, default: Date.now},
    message: {type: String},
});

// ==================================== document schema=======================================//
const driverSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: String },
    phoneNumber: { type: String },
    emailAddress: { type: String },
    profileImg: {type: String},
    password: { type: String },
// ==== driver specific details =====
    staffId: { type: String },
    driverLicense: { type: String },
    startDate: {type: Date, default: Date.now},
    driverScore: {type: Number, default: 10},
// ==================================
    notifications: [notificationSchema],
});

driverSchema.plugin(passportLocalMongoose);

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('driver', driverSchema);