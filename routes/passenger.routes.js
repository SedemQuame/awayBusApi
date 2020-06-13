// jshint esversion:6 
// ================================ creating application routes ===================================//
module.exports = app => {
    const passenger = require(`../controllers/passenger.controllers`);

// create routes
    app.route(`/createPassengerAccount`)
        .post(passenger.createPassengerAccount);

//  delete routes
    app.route(`/deletePassengerAccount`)
        .post(passenger.deletePassengerAccount);

// get routes
    app.route(`/getAllPassengers`)
        .get(passenger.getAllPassengers);

    app.route(`/getPassengerById`)
        .get(passenger.getPassengerById);

// update routes
    app.route(`/updatePassengerCredentials`)
        .post(passenger.updatePassengerCredentials);
};