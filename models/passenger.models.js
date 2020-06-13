//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// ==================================== sub-document schemas ==========================================//
const bookingSchema = new mongoose.Schema({
    busId: {type: String},
    routeId: {type: String},
    receiptUrl: {type: String},
});

const notificationSchema = new mongoose.Schema({
    notificationDate: {type: Date, default: Date.now},
    message: {type: String},
});

// ==================================== document schema=======================================//
const passengerSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: String },
    phoneNumber: { type: String },
    emailAddress: { type: String },
    profileImg: {type: String},
    password: { type: String },
// ==================================
    bookings: [bookingSchema],
    notifications: [notificationSchema],
});

passengerSchema.plugin(passportLocalMongoose);

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('passenger', passengerSchema);