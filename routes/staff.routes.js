// jshint esversion:6

// ================================ creating application routes ===================================//
module.exports = app => {
    const staff = require(`../controllers/staff.controllers`);

    // create routes
    app.route(`/staffLogin`)
        .get(staff.staffLogin);

    app.route(`/accessAdminAccount`)
        .post(staff.accessAdminAccount);

    app.route(`/createNewStaffAccount`)
        .post(staff.createNewStaffAccount);

    app.route(`/staff`)
        .get(staff.getAllStaffDetails);

    app.route(`/staff/logout`)
        .get(staff.staffLogOut);

    app.route(`/searchStaff`)
        .get(staff.searchStaff);

    app.route(`/deleteStaffAccount/:staffId`)
        .post(staff.deleteStaffAccount);

    app.route(`/getStaffAccountById/:staffId`)
        .post(staff.getStaffAccountById);

    // rendering pages
    app.route(`/activeTrips`)
        .get(staff.activeTrips);

    app.route(`/reset`)
        .get(staff.forgotPassword);

    app.route(`/reset`)
        .post(staff.resetPassword);

    // app.get(`/buses`, (req, res) => {
    //     res.render(`${__dirname}/../views/staff/buses.views.ejs`);
    // });

    app.get(`/notifications`, (req, res) => {
        res.render(`${__dirname}/../views/staff/notifications.views.ejs`);
    });

    app.get(`/financials`, (req, res) => {
        res.render(`${__dirname}/../views/staff/financials.views.ejs`);
    });

    app.route(`/resetPassword`)
        .post(staff.changePassword);
};
