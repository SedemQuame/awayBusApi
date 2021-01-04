// jshint esversion:6
// ===================== node modules ======================

// =================== custom modules ======================
const driver = require(`../models/driver.models`);
const spawn = require(`spawn-password`);
// exports


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// exports

exports.createDriverAccount = (req, res, next) => {
    let generatedPswd = null;
    if (req.body.passwordGenerationMethod === `on`) {
        generatedPswd = spawn.spawn();
    }
    console.log(`Generated password: ${generatedPswd}`);
    const msg = {
        to: req.body.dEmailAddress,
        from: `noreply@awaybus.com`,
        subject: `AwayBus Staff Account`,
        text: `Hello ${req.body.dFirstName} ${req.body.dLastName} below are the crendentials for your AwayBus staff account.
            Email address: ${req.body.dEmailAddress}
            Password: ${generatedPswd}
        `,
    };

    sgMail.send(msg).catch((err) => {
        console.error(err);
    });
    let spawned_password = spawn.spawn();
    driver.create({
        firstName: req.body.dFirstName,
        lastName: req.body.dLastName,
        dateOfBirth: req.body.dDateOfBirth,
        phoneNumber: req.body.dPhoneNumber,
        emailAddress: req.body.dEmailAddress,
        profileImg: req.body.dProfileImg,
        password: req.body.dPassword,
        driverLicense: req.body.driverLicense,
        accessLevel: 1,
        staffType: `Driver`,
        notifications: [],
        username: spawned_password,
    }).then((doc) => {
        // res.status(200).send({
        //     status: 200,
        //     message: `Successfully created a driver account.`
        // });
        console.log(doc);
        // Must add context to redirect params.
        res.redirect(`/staff`);
    }).catch((err) => {
        // res.status(404).send({
        //     status: 404,
        //     error: err,
        //     message: `Unable to create driver account.`
        // });

        // Must add context to redirect params.
        console.log(err);
        res.redirect(`/staff`);
    });
};

exports.createDriverNotifications = (req, res, next) => {
    console.log(`Create Driver Account`);
    console.log(req.body);
};

exports.deleteDriverById = (req, res, next) => {
    driver.findByIdAndDelete({ _id: req.params.driverId })
        .then(() => {
            res.status(200).send({
                status: 200,
                message: `Successfully deleted a driver account.`
            });
        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            id: req.body.driverId,
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
    driver.findById({ _id: req.params.driverId })
        .then((doc) => {
            res.status(200).send({
                status: 200,
                data: doc,
                msg: `Successfully returned driver account.`
            });
        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            msg: `Unable to return driver account.`
        });
    });
};

exports.updateDriverCredentials = (req, res, next) => {
    console.log(`Update Driver Account`);
    console.log(req.body);
    driver.findByIdAndUpdate({ _id: req.body.Id })
        .then((doc) => {

        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to update driver account.`
        });
    });
};
