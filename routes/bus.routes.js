// jshint esversion:6 
// ================================ creating application routes ===================================//
module.exports = app => {
    const bus = require(`../controllers/bus.controllers`);

// create routes
    app.route(`/createBus`)
        .post(bus.createBus);

    app.route(`/createPassengerReview`)
        .post(bus.createPassengerReview);

//  delete routes
    app.route(`/deleteBus`)
        .post(bus.deleteBus);

// get routes
    app.route(`/getAllBus`)
        .get(bus.getAllBus);

    app.route(`/getBusById`)
        .get(bus.getBusById);

    // app.route(`/getBusByName`)
    //     .get(bus.getBusBy)
        
// update routes
    app.route(`/updateBusInfo`)
        .post(bus.uploadBusInfo);
};