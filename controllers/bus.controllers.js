// jshint esversion:6
// ===================== node modules ======================

// =================== custom modules ======================
const bus = require(`../models/bus.models`);

// exports
exports.createBus = (req, res, next) => {
    bus.create({
        driverId: req.body.driverId,
        cargoVolume: req.body.cargoVolume + " FTQ", // unit in cubic foot
        driversLicense: req.body.driversLicense,
        accelerationTime: req.body.accelerationTime + " MPH",
        busSeatingCapacity: req.body.busSeatingCapacity + "People",
        busSpeed: req.body.busSpeed + " MPH",
        imageUrl:req.body.imageUrl,
        fuel: {
            fuelType: req.body.fuelType,
            fuelCapacity: req.body.fuelCapacity + " LITRES",
            fuelConsumption: req.body.fuelConsumption,
        },
        passengerReviews: []
    }).then(() => {
        res.status(200).send({
            status: 200,
            message: `Bus created successfully.`,
        });
    }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to add review.`
        });
    });
};

exports.createPassengerReview = (req, res, next) => {
    bus.findByIdAndUpdate({_id: req.body.Id})
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

exports.deleteBus = (req, res, next) => {

    bus.findByIdAndDelete({_id: req.body.Id})
        .then((doc) => {
            res.status(200).send({
                status: 200,
                buses: doc,
                message: `Bus deleted successfully.`,
            });
        }).catch((err) => {
            res.status(404).send({
                status: 404,
                error: err,
                message: `Unable to delete bus.`,
            });
        });
};

exports.getAllBus = (req, res, next) => {
    bus.find({})
        .then((docs) => {
            res.status(200).send({
                status: 200,
                buses: docs,
                message: `All buses returned successfully.`,
            });
        }).catch((err) => {
            res.status(404).send({
                status:404,
                error: err,
                message: `Unable to return buses.`,
            });
        });
};

exports.getBusById = (req, res, next) => {
    bus.findById({_id: req.body.Id})
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

exports.uploadBusInfo = (req, res, next) => {
    bus.findByIdAndUpdate({_id: req.body.Id})
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