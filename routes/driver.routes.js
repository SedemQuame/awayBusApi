// jshint esversion:6 
// ================================ creating application routes ===================================//
module.exports = app => {
    const driver = require(`../controllers/driver.controllers`);

// create routes
    app.route(`/createDriverAccount`)
        .post(driver.createDriverAccount);

    app.route(`/createDriverNotifications`)
        .post(driver.createDriverNotifications)

//  delete routes
    app.route(`/deleteDriverById`)
        .post(driver.deleteDriverById);

// get routes
    app.route(`/getAllDrivers`)
        .get(driver.getAllDrivers);

    app.route(`/getDriverById`)
        .get(driver.getDriverById);

// update routes
    app.route(`/updateDriverCredentials`)
        .post(driver.updateDriverCredentials);
    
};