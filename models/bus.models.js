//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require(`mongoose`);
const passportLocalMongoose = require(`passport-local-mongoose`);

// ==================================== creating database schema=======================================//

const fuelSchema = new mongoose.Schema({
    fuelType: { type: String },
    fuelCapacity: { type: String },
    fuelConsumption: { type: String },
});

const passengerReviewSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    passengerId: {type: String},
    comment: {type: String},
});

const busSchema = new mongoose.Schema({
    driverId: { type: String },
    cargoVolume: { type: String },
    driversLicense: { type: String },
    accelerationTime: { type: String },
    busSeatingCapacity: { type: String },
    busSpeed: { type: String },
    imageUrl: { type: String },
// ==================================
    fuel: fuelSchema,
    passengerReviews: [passengerReviewSchema],
});

busSchema.plugin(passportLocalMongoose);

// ==================================== creating schema model =========================================//
module.exports = mongoose.model(`Bus`, busSchema);