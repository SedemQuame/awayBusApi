//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// ==================================== sub-document schemas ==========================================//
const bookingSchema = new mongoose.Schema({
    bus_id: { type: String },
    route_id: { type: String },
    seats: { type: String },
    journey: { type: String },
});

const notificationSchema = new mongoose.Schema({
    notificationDate: { type: Date, default: Date.now },
    message: { type: String },
});

// ==================================== document schema=======================================//
const passengerSchema = new mongoose.Schema({
    fullname: { type: String },
    phoneNumber: { type: String, unique: true, required: true, dropDups: true },
    emailAddress: { type: String, unique: true, required: true, dropDups: true },
    password: { type: String },
    bookings: [bookingSchema],
    notifications: [notificationSchema],
});

passengerSchema.plugin(passportLocalMongoose);

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('passenger', passengerSchema);