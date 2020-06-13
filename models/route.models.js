// jshint esversion:6 
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// ==================================== sub-document schemas ==========================================//


// ==================================== document schema=======================================//
const routeSchema = new mongoose.Schema({
    bookingDate: {type: Date, default: Date.now},
    departureBusStop: {type: String},
    departureTime: {type: String},
    arrivalBusStop: {type: String},
    arrivalTime: {type: String},
    busNumber: {type: String},
    itinerary: {type: String},
    imageUrl: {type: String},
});

routeSchema.plugin(passportLocalMongoose);

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('route', routeSchema);