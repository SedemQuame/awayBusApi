// jshint esversion:6
// ===================== node modules ======================
const bcrypt = require('bcrypt');
const spawn = require("spawn-password");
const SALT_ROUNDS = 12;
// =================== custom modules ======================
const staff = require(`../models/staff.models`);
const driver = require(`../models/driver.models`);
const route = require(`../models/route.models`);
const { DocumentProvider } = require('mongoose');

// MAIL_PROVIDERS
// 1. SendGrid Mail
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 2. MailGun Mail
const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });

// exports
exports.staffLogin = (req, res, next) => {
    staff.countDocuments({}, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            const obj = {
                msg: null,
                staffInfo: null,
            };
            if (result > 0) {
                res.render(`${__dirname}/../views/staff/login.views.ejs`, obj);
            } else {
                res.render(`${__dirname}/../views/staff/rootadmin.views.ejs`, obj);
            }
        }
    });
};

exports.accessAdminAccount = (req, res, next) => {
    staff.findOne({ emailAddress: req.body.emailAddress }).then((returnedStaff) => {
        req.session.staff = returnedStaff;
        bcrypt.compare(req.body.password, returnedStaff.password, function (err, result) {
            if (err) {
                res.render(`${__dirname}/../views/staff/login.views.ejs`, {
                    msg: `Server side error.`,
                    staffInfo: null,
                });
                return;
            }
            if (result) {
                staff.find({}).then(staff => {
                    driver.find({}).then(drivers => {
                        res.render(__dirname + '/../views/staff/staff.views.ejs', {
                            message: null,
                            staffDocs: staff,
                            driverDocs: drivers,
                            accessLevel: (req.session.staff).accessLevel,
                            staffInfo: req.session.staff,
                        });
                    }).catch(err => {
                        // Change action to handle error gracefully.
                        res.render(__dirname + '/../views/staff/staff.views.ejs', {
                            message: `Unable to return staff information`,
                            staffDocs: staff,
                            driverDocs: drivers,
                            accessLevel: (req.session.staff).accessLevel,
                            staffInfo: req.session.staff,
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                    // Must add context to redirect params.
                    res.redirect(`/staff`);
                });
            } else {
                res.render(`${__dirname}/../views/staff/login.views.ejs`, {
                    msg: `Account log in not failed.`,
                    staffInfo: null,
                });
            }
        });
    }).catch((err) => {
        res.render(`${__dirname}/../views/staff/login.views.ejs`, {
            msg: "User account not found.",
            staffInfo: null,
        });
    });
};

exports.createNewStaffAccount = (req, res, next) => {
    let pwsd = spawn.spawnAlphaNumeric()
    const msg = {
        to: req.body.emailAddress,
        from: `noreply@awaybus.com`,
        subject: `AwayBus Staff Account`,
        text: `
        Hello ${req.body.firstName} ${req.body.lastName} below are the crendentials for your AwayBus staff account.
        Email address: ${req.body.emailAddress}
        Password: ${pwsd}
        Portal: https://awaybus.herokuapp.com/staffLogin
        `,
    };
    console.log(pwsd);

    bcrypt.hash(pwsd, SALT_ROUNDS, (err, hash) => {
        let spawned_password = spawn.spawn();
        staff.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: spawned_password,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber,
            emailAddress: req.body.emailAddress,
            profileImg: req.body.profileImage,
            password: hash,
            accessLevel: req.body.staffAccessLevel,
            staffType: req.body.staffType,
        }).then((doc) => {
            // store staff data in sessions
            req.session.staff = doc;
            // send email
            // sgMail.send(msg).catch((err) => {
            //     console.error(err);
            // });
            // Must add context to redirect params.
            res.redirect(`/staff`);
        }).catch((err) => {
            // console.log(err);
            // Must add context to redirect params.
            res.redirect(`/staff`);
        });
    });
};

exports.getAllStaffDetails = (req, res, next) => {
    staff.find({}).then(staff => {
        console.log(req.session.staff);
        driver.find({}).then(drivers => {
            res.render(__dirname + '/../views/staff/staff.views.ejs', {
                message: null,
                staffDocs: staff,
                driverDocs: drivers,
                accessLevel: (req.session.staff).accessLevel,
                staffInfo: req.session.staff,
            });
        }).catch(err => {
            // Change action to handle error gracefully.
            res.render(__dirname + '/../views/staff/staff.views.ejs', {
                message: `Unable to return all staff details.`,
                staffDocs: null,
                driverDocs: null,
                accessLevel: (req.session.staff).accessLevel,
                staffInfo: req.session.staff,
            });
        });
    }).catch((err) => {
        console.log(err);
        // Must add context to redirect params.
        res.redirect(`/staff`);
    });
};

exports.staffLogOut = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            res.render(__dirname + `/../views/404.views.ejs`, {
                message: `Unable to logout.`,
                staffDocs: null,
                driverDocs: null,
                accessLevel: null,
                staffInfo: null,
            });
        }
        res.render(__dirname + `/../views/staff/login.views.ejs`, {
            msg: `Logout successful.`,
            staffDocs: null,
            driverDocs: null,
            accessLevel: null,
            staffInfo: null,
        });
    });
};

exports.deleteStaffAccount = (req, res, next) => {
    let staffId = req.params.staffId;
    staff.findByIdAndDelete({ _id: staffId }).then(() => {
        res.redirect(`/staff/logout`);
    }).catch(err => {
        res.status(202).send({
            msg: `Failed to deleted Staff Account.`
        });
    });
};

exports.searchStaff = (req, res, next) => {
    let searchTerm = req.query.searchTerm;
    let searchTag = req.query.searchPassengers;
    let obj = null;
    if (searchTag == 'Name') {
        obj = { firstName: searchTerm };
    } else if (searchTag == 'Email') {
        obj = { emailAddress: searchTerm };
    } else if (searchTag == 'Type') {
        obj = { staffType: searchTerm };
    }
    staff.find(obj).then(docs => {
        res.render(__dirname + '/../views/staff/staff.views.ejs', {
            message: null,
            staffDocs: docs,
            driverDocs: [],
            accessLevel: (req.session.staff).accessLevel,
            staffInfo: req.session.staff,
        });
    }).catch(err => {
        console.log(err);
        // Must add context to redirect params.
        res.redirect(`/staff`);
    });
};

exports.getStaffAccountById = (req, res, next) => {
    staff.findById({ _id: req.params.staffId }).then((doc) => {
        res.status(400).send({
            msg: `Successfully returned staff details.`,
            data: doc,
        });
    }).catch(err => {
        res.status(202).send({
            msg: `Failed to return staff details.`,
            data: null,
        });
    });
};

exports.activeTrips = (req, res, next) => {
    route.find({}).select('_id departurePoint arrivalPoint departureTime farePerPerson state').then(trips => {
        console.log(trips);
        res.render(`${__dirname}/../views/staff/index.views.ejs`, {
            trips: trips,
            msg: `Success`,
            staffDocs: null,
            driverDocs: null,
            accessLevel: (req.session.staff).accessLevel,
            staffInfo: req.session.staff,
        });
    }).catch(err => {
        res.render(`${__dirname}/../views/staff/index.views.ejs`, {
            trips: [],
            msg: 'Failed',
            staffDocs: null,
            driverDocs: null,
            accessLevel: (req.session.staff).accessLevel,
            staffInfo: req.session.staff,
        });
    });
};

exports.forgotPassword = (req, res, next) => {
    res.render(`${__dirname}/../views/staff/forgotPassword.ejs`, {
        msg: null,
        staffDocs: null,
        driverDocs: null,
        accessLevel: null,
        staffInfo: null,
    });
};

exports.resetPassword = (req, res, next) => {
    staff.findOne({ emailAddress: req.body.emailAddress }).then((staff) => {
        req.session.emailToResetPwsd = req.body.emailAddress;
        if (staff != null) {
            const msg = {
                from: `sedem.amekpewu@turntabl.io`,
                to: req.body.emailAddress,
                subject: `Generate new password`,
                text: `
                    Hello ${staff.firstName} below is the new password for your account.
                    Please follow the link to change your password
                    Portal: https://awaybus.herokuapp.com/resetPassword
                `,
            };
            mailgun.messages().send(msg).then(() => {
                res.render(`${__dirname}/../views/staff/forgotPassword.ejs`, { msg: `Password reset sent to your email.` });
            }).catch((err) => {
                // console.log(err);
                if (err.response) {
                    // Extract error msg
                    const { message, code, response } = err;

                    // Extract response msg
                    const { headers, body } = response;

                    console.error(body);
                }
                res.render(`${__dirname}/../views/staff/forgotPassword.ejs`, { msg: `Unable to generate a new password.` });
            });

            // sgMail.send(msg).then(()=>{
            //     res.render(`${__dirname}/../views/staff/forgotPassword.ejs`, {msg: `Password reset sent to your email.`});
            // }).catch((err) => {
            //     console.log(err);
            //     if (err.response) {
            //         // Extract error msg
            //         const {message, code, response} = err;

            //         // Extract response msg
            //         const {headers, body} = response;

            //         console.error(body);
            //     }
            //     res.render(`${__dirname}/../views/staff/forgotPassword.ejs`, {msg: `Unable to generate a new password.`});
            // });
        } else {
            res.render(`${__dirname}/../views/staff/forgotPassword.ejs`, { msg: `User account does not exist.` });
        }


    }).catch((err) => {
        // console.log(err);
        res.render(`${__dirname}/../views/staff/forgotPassword.ejs`, { msg: `Unable to generate a new password.` });
    });

};

exports.changePassword = (req, res, next) => {
    // check if the account is that of a passenger or a staff.
    staff.findOne({
        emailAddress: req.session.emailToResetPwsd
    }).then(user => {
        bcrypt.hash(req.body.newPassword, SALT_ROUNDS, (err, hash) => {
            user.password = hash;
            user.save();
        });
        // Add message for login
        res.redirect("/login");
    }).catch(err => {
        // Add error message.
        res.redirect("/login");
    });
};
