//jshint esversion:6
// ===================================== requiring node modules ===================================== //
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// ==================================== sub-document schemas ==========================================//
const notificationSchema = new mongoose.Schema({
    notificationDate: { type: Date, default: Date.now },
    message: { type: String },
});

const roleSchema = new mongoose.Schema({
    role: {type: String},
    roleId: {type: String}
});

// ==================================== document schema=======================================//
const staffSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: String },
    phoneNumber: { type: String },
    emailAddress: { type: String },
    profileImg: { type: String },
    password: { type: String },
    accessLevel: { type: Number },
    staffType: { type: String },
    // ==================================
    notifications: [notificationSchema],
    roles: [roleSchema]
});

staffSchema.plugin(passportLocalMongoose, {
    // Set usernameUnique to false to avoid a mongodb index on the username column!
    usernameUnique: false
});

// ==================================== creating schema model =========================================//
module.exports = mongoose.model('staff', staffSchema);