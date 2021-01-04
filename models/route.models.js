// jshint esversion:6 
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// ==================================== sub-document schemas ==========================================//
const seatArrangeSchema = new mongoose.Schema({
    // rows: { type: Number },
    // cols: { type: Number },
    arrangementMatrix: [],
});
// ==================================== document schema=======================================//
const routeSchema = new mongoose.Schema({
    creationDate: { type: Date, default: Date.now },
    busNumberPlate: { type: String },
    busCapacity: { type: Number },
    departurePoint: { type: String },
    arrivalPoint: { type: String },
    departureTime: { type: String },
    arrivalTime: { type: String },
    departureDate: { type: String },
    farePerPerson: { type: String },
    state: { type: String, enum: ['Pending', 'Active', 'Ended'], default: 'Pending' },
    pickUpPoints: [{ type: String }],
    dropOffPoints: [{ type: String }],
    busTerminal: { type: String },
    applicableCouponCode: { type: String },
    // ================================
    seatArrangement: seatArrangeSchema,
});
routeSchema.plugin(passportLocalMongoose);
// ==================================== creating schema model =========================================//
module.exports = mongoose.model('route', routeSchema);