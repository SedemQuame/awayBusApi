// jshint esversion:6
// ===================== node modules ======================

// =================== custom modules ======================
const passenger = require(`../models/passenger.models`);
// exports
exports.createPassengerAccount = (req, res, next) => {
    passenger.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress,
        profileImg: req.body.profileImg,
        password: req.body.password,
        bookings: [],
        notifications: [],
    }).then((doc) => {
        // send unique passenger identification.
        res.status(200).send({
            status: `Completed`,
            userId: doc._id,
            message: `Passenger account created successfully.`
        });
    }).catch((err) => {
        res.status(404).send({
            status: `Not Found`,
            error: err,
            message: `Unable to create passenger account.`
        });
    });
};

exports.deletePassengerAccount = (req, res, next) => {
    passenger.findByIdAndDelete({_id: req.body.Id})
        .then((doc) => {
            res.status(200).send({
                status: `Completed`,
                message: `Account deleted successfully.`
            });
        }).catch((err) => {
            res.status(404).send({
                status: `Not Found`,
                error: err,
                message: `Unable to delete passenger account.`
            });
        });
};

exports.getAllPassengers = (req, res, next) => {
    passenger.find({})
        .then((docs) => {
            res.status(200).send({
                status: `Completed`,
                passengers: docs,
                message: `Successfully returned passengers.`
            });
        }).catch((err) => {
            res.status(404).send({
                status: `Not Found`,
                passengers: [],
                error: err,
                message: `Unable to return all passenger accounts.`
            });
        });
};

exports.getPassengerById = (req, res, next) => {
    passenger.find({_id: req.body.Id})
        .then((doc) => {
            res.status(200).send({
                status: `Completed`,
                passenger: doc,
                message:`Successfully returned passengers details.`
            });
        }).catch((err) => {
            res.status(404).send({
                status: `Not Found`,
                passenger: {},
                error: err,
                message:`Unable to return passenger details.`
            });
        });
};

exports.updatePassengerCredentials = (req, res, next) => {
    console.log(`Update passenger account by id`);
    console.log(req.body);
    passenger.findByIdAndUpdate({_id: req.body.Id})
        .then((doc) => {
            doc.firstName   = req.body.firstName;
            doc.middleName  = req.body.middleName;
            doc.lastName    = req.body.lastName;
            doc.dateOfBirth = req.body.dateOfBirth;
            doc.phoneNumber = req.body.phoneNumber;
            doc.emailAddress= req.body.emailAddress;
            doc.profileImg  = req.body.profileImg;
            doc.password    = req.body.password;
            doc.save();
            res.status(200).send({
                status: `Updated`,
                message: `Successfully updated passenger details.`
            });
        }).catch((err) => {
            res.status(404).send({
                status: `Not Found`,
                error: err,
                message: `Unable to update passenger details.`
            });
        });
};
