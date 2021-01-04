// jshint esversion:6
// ===================== node modules ======================

// =================== custom modules ======================
const bus = require(`../models/bus.models`);
const driver = require(`../models/driver.models`);
const spawn = require("spawn-password");

function convertToBoolean(value) {
    if (value == 'on') {
        return true;
    }
    return false;
}

// exports
exports.createBus = (req, res) => {
    console.log(req.body);
    let spawned_password = spawn.spawn();

    // creating object to store seating arrangement.
    // let seatRows = req.body.row;
    // let seatCols = req.body.col;

    bus.create({
        busOwner: req.body.busOwner,
        busSeatingCapacity: req.body.seatingCapacity,
        busModel: req.body.busModel,
        cargoVolume: req.body.cargoVolume + " FTQ", // unit in cubic foot
        accelerationTime: req.body.accelerationTime + " MPH",
        busSpeed: req.body.busSpeed + " MPH",
        busMileage: req.body.currentMileage,
        busNumberPlate: (req.body.numberPlate).toUpperCase(),
        busColor: req.body.busColor,
        profileCreatorNotes: req.body.busCreatorNotes,
        busImageUrls: req.body.busImage,
        driverId: req.body.driverId,
        fuel: {
            fuelType: req.body.fuelType,
            fuelCapacity: req.body.fuelCapacity + " LITRES",
            fuelConsumption: req.body.fuelConsumption,
        },
        passengerReviews: [],
        amenities: {
            luggageRacks: convertToBoolean(req.body.luggageRacks),
            onBoardWifi: convertToBoolean(req.body.wifi),
            onBoardRestRooms: convertToBoolean(req.body.fuelConsumption),
            onBoardEntertainment: convertToBoolean(req.body.entertainment),
            passengerServiceUnits: convertToBoolean(req.body.serviceUnit),
            refreshmentService: convertToBoolean(req.body.refreshments),
            onBoardACPower: convertToBoolean(req.body.acPower),
        },
        // seatArrangement: {
        //     rows: seatRows,
        //     cols: seatCols,
        // },
        username: spawned_password,
    }).then(() => {
        res.redirect(`/buses`);
    }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to add review.`
        });
    });
};

exports.createPassengerReview = (req, res) => {
    console.log("Passenger Review: ");
    console.log(req.body);
    bus.findByIdAndUpdate({ _id: req.body.Id })
        .then((doc) => {
            doc.passengerReviews.push({
                passengerId: req.body.passengerId,
                comment: req.body.comment
            });
            doc.save();
            res.status(200).send({
                status: 200,
                message: `Review successfully recorded.`,
            });
        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to add review.`
        });
    });
};

exports.deleteBusById = (req, res) => {
    bus.findByIdAndDelete({ _id: req.params.busId })
        .then(() => {
            res.status(200).send({
                status: 200,
                msg: `Bus deleted successfully.`,
            });
        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            msg: `Unable to delete bus.`,
        });
    });
};

exports.getAllBus = (req, res) => {
    console.log(`Get All Bus`);
    bus.find({})
        .then((buses) => {
            console.log(buses);
            // Get Bus Driver Information.
            driver.find({}).then(drivers => {
                console.log(drivers);
                res.status(200).send({
                    status: 200,
                    message: `Bus created successfully.`,
                    busList: buses,
                    driverList: drivers,
                    staffInfo: req.session.staff,
                });
            }).catch((err) => {
                res.status(404).send({
                    status: 404,
                    error: err,
                    message: `Unable to return buses.`,
                    staffInfo: req.session.staff,
                });
            });
        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to return buses.`,
            staffInfo: req.session.staff,
        });
    });
};

exports.getBusById = (req, res) => {
    console.log(`Get Bus By Id`);
    console.log(req.params);
    bus.findById({ _id: req.params.busId })
        .then((doc) => {
            res.status(200).send({
                status: 200,
                bus: doc,
                message: `Bus returned successfully.`,
            });
        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to return buses.`,
        });
    });
};

exports.uploadBusInfo = (req, res) => {
    console.log(`Update Bus Bus`);
    console.log(req.body);
    bus.findByIdAndUpdate({ _id: req.body.Id })
        .then(() => {
            res.status(200).send({
                status: 200,
                message: `Bus information updated successfully.`,
            });
        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to update bus info.`,
        });
    });
};

exports.searchBuses = (req, res) => {
    bus.find({ busNumberPlate: req.body.searchTerm }).then(docs => {
        res.status(200).send({
            status: 200,
            message: `Bus created successfully.`,
            busList: docs,
            staffInfo: req.session.staff,
        });
    }).catch(err => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to return buses.`,
            staffInfo: req.session.staff,
        });
    });
};

exports.getBusMetaData = (req, res) => {
    bus.find({}).then(docs => {
        res.status(200).send({
            status: 200,
            message: `Docs retrieved.`,
            busList: docs,
        });
    }).catch(err => {
        res.status(404).send({
            status: 404,
            message: `Unable to retrieve docs.`,
            busList: err,
        });
    });
};

// exports.getBusAndDriverInfo = (req, res) => {
//     bus.find({}).then(buses => {
//         driver.find({}).then(drivers => {
//             res.send({
//                 buses: buses,
//                 drivers: drivers
//             });
//         }).catch(err => {
//             res.send({
//                 status: 404,
//                 message: `Unable to retrieve docs.`,
//                 busList: err,
//             });
//         });
//     }).catch(err => {
//         console.log(err);
//     });
// };