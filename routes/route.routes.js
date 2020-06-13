// jshint esversion:6 
// ================================ creating application routes ===================================//
module.exports = app => {
    const route = require(`../controllers/route.controllers`);

// create routes
    app.route(`createBusRoute`)
        .post(route.createBusRoute);

//  delete routes
    app.route(`deleteBusRouteById`)
        .post(route.deleteRoute);

// get routes
    app.route(`/getRoutes`)
        .get(route.getRoutes);

    app.route(`/getRouteById`)
        .get(route.getRouteById);

// update routes
    app.route(`/updateRouteById`)
        .get(route.updateRoute);
};