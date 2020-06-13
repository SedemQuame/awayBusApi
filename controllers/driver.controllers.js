// jshint esversion:6
// ===================== node modules ======================

// =================== custom modules ======================
const driver = require(`../models/driver.models`);
// exports
exports.createDriverAccount = (req, res, next) => {
    console.log(`Create Driver Account`);
    console.log(req.body);
    
    driver.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        phoneNumber: req.body.phoneNumber,
        emailAddress: req.body.emailAddress,
        profileImg: req.body.profileImg,
        password: req.body.password,
        staffId: req.body.staffId,
        driverLicense: req.body.driverLicense,
        notifications: [],
    }).then(() => {
        res.status(200).send({
            status: 200,
            message: `Successfully created a driver account.`
        });
    }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to create driver account.`
        });
    });
};

exports.createDriverNotifications = (req, res, next) => {
    console.log(`Create Driver Account`);
    console.log(req.body);
};

exports.deleteDriverById = (req, res, next) => {
    console.log(`Delete Driver Account By Id`);
    console.log(req.body);
    driver.findByIdAndDelete({_id: req.body.Id})
        .then(() => {
            res.status(200).send({
                status: 200,
                message: `Successfully deleted a driver account.`
            });
        }).catch((err) => {
            res.status(404).send({
                status: 404,
                error: err,
                message: `Unable to delete driver account.`
            });
        });
};

exports.getAllDrivers = (req, res, next) => {
    console.log(`Get All Driver Account`);
    console.log(req.body);
    driver.find({}).then((docs) => {
        res.status(200).send({
            status: 200,
            drivers: docs,
            message: `Successfully returned all driver accounts.`
        });
    }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to return all drivers.`
        });
    });
};

exports.getDriverById = (req, res, next) => {
    console.log(`Get Driver Account By Id`);
    console.log(req.body);
    driver.findById({_id: req.body.Id})
        .then((doc) => {
            res.status(200).send({
                status: 200,
                driver: doc,
                message: `Successfully returned driver account.`
            });
        }).catch((err) => {
            res.status(404).send({
                status: 404,
                error: err,
                message: `Unable to return driver account.`
            });
        });
};

exports.updateDriverCredentials = (req, res, next) => {
    console.log(`Update Driver Account`);
    console.log(req.body);
    driver.findByIdAndUpdate({_id: req.body.Id})
        .then((doc) => {

        }).catch((err) => {
            res.status(404).send({
                status: 404,
                error: err,
                message: `Unable to update driver account.`
            });
        });
};
