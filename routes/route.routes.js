// jshint esversion:6 
// ================================ creating application routes ===================================//
module.exports = app => {
    const route = require(`../controllers/route.controllers`);
    // create routes
    app.route(`/createBusRoute`)
        .post(route.createBusRoute);

    //  delete routes
    app.route(`/deleteBusRouteById/:routeId`)
        .post(route.deleteRoute);

    // get routes
    app.route(`/routes`)
        .get(route.getRoutes);

    app.route(`/getRouteById/:routeId`)
        .post(route.getRouteById);

    app.route(`/updateTripState/:tripId/:state`)
        .post(route.updateTripState);

    app.route(`/getAllBusRoutes`)
        .get(route.getAllBusRoutes);

    // update routes
    app.route(`/updateRouteById`)
        .get(route.updateRoute);

    // search routes
    app.route(`/searchRoutes`)
        .get(route.searchRoutes);

    app.route(`/query/from/:term`)
        .get(route.queryFromTerm);

    app.route(`/query/to/:term`)
        .get(route.queryToTerm);

    app.route(`/checkOut`)
        .post(route.selectSeatAndCheckOut);

    app.route(`/ticket`)
        .get(route.printTicket);

    app.route(`/validateCoupon/:routeId/:couponId`)
        .post(route.validateCoupon);
};