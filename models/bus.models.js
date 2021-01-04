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
    date: { type: Date, default: Date.now },
    passengerId: { type: String },
    comment: { type: String },
});

const amenitiesSchema = new mongoose.Schema({
    luggageRacks: { type: Boolean },
    passengerServiceUnits: { type: Boolean },
    onBoardRestRooms: { type: Boolean },
    onBoardEntertainment: { type: Boolean },
    refereshmentService: { type: Boolean },
    onBoardWifi: { type: Boolean },
    onBoardACPower: { type: Boolean },
});

// const seat = new mongoose.Schema({
//     value: {type: String},
//     booked: {type: Boolean}
// });

// const seatArrangeSchema = new mongoose.Schema({
//     rows: { type: Number },
//     cols: { type: Number },
// });


const busSchema = new mongoose.Schema({
    busOwner: { type: String },
    busSeatingCapacity: { type: String },
    busModel: { type: String },
    cargoVolume: { type: String },
    accelerationTime: { type: String },
    busSpeed: { type: String },
    busMileage: { type: String },
    busNumberPlate: { type: String },
    busColor: { type: String },
    profileCreatorNotes: { type: String },
    busImageUrls: [],
    driverId: { type: String },
    // ==================================
    fuel: fuelSchema,
    passengerReviews: [passengerReviewSchema],
    amenities: amenitiesSchema,
    // ==================================
    // seatArrangement: seatArrangeSchema,
});

busSchema.plugin(passportLocalMongoose);

// ==================================== creating schema model =========================================//
module.exports = mongoose.model(`Bus`, busSchema);