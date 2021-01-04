// jshint esversion:6

// ================================ creating application routes ===================================//
module.exports = app => {
    const passenger = require(`../controllers/passenger.controllers`);

    // create passengers accounts
    app.route(`/create`)
        .post(passenger.createPassengerAccount);

    // log into passenger account
    app.route(`/login`)
        .post(passenger.accessPassengerAccount);

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

    app.route(`/users`)
        .get(passenger.getAllPassengers);

    app.route(`/searchPassengers`)
        .post(passenger.searchPassengers);
};
