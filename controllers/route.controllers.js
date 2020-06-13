// jshint esversion:6
// ===================== node modules ======================

// =================== custom modules ======================
const routes = require(`../models/route.models`);
// exports
exports.createBusRoute = (req, res, next) => {
    routes.create({
        bookingDate: req.body.bookingDate,
        departureBusStop: req.body.departureBusStop,
        departureTime: req.body.departureTime,
        arrivalBusStop: req.body.arrivalBusStop,
        arrivalTime: req.body.arrivalTime,
        busNumber: req.body.busNumber,
        itinerary: req.body.itinerary,
        imageUrl: req.body.imageUrl,
    }).then(() => {
        res.status(200).send({
            status: 200,
            message: `Created bus route successfully.`
        });
    }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to create a bus route.`
        });
    });
};

exports.deleteRoute = (req, res, next) => {
    routes.findByIdAndDelete({_id: req.body.Id})
        .then(() => {
            res.status(200).send({
                status: 200,
                message: `Deleted bus route successfully.`
            });
        }).catch((err) => {
            res.status(404).send({
                status: 404,
                error: err,
                message: `Unable to delete bus route.`
            });
        });
};

exports.getRoutes = (req, res, next) => {
    routes.find({})
        .then((docs) => {
            res.status(200).send({
                status: 200,
                routes: docs,
                message: `Returned all bus routes successfully.`
            });
        }).catch((err) => {
            res.status(404).send({
                status: 404,
                error: err,
                message: `Unable to get all bus routes.`
            });
        });
};

exports.getRouteById = (req, res, next) => {
    routes.findById({_id: req.body.Id})
        .then((doc) => {
            res.status(200).send({
                status: 200,
                route: doc,
                message: `Returned bus route successfully.`
            });
        }).catch((err) => {
            res.status(404).send({
                status: 404,
                error: err,
                message: `Unable to get all bus route`
            });
        });
};

exports.updateRoute = (req, res, next) => {
    routes.findByIdAndUpdate({_id: req.body.Id})
    .then((doc) => {
        doc.bookingDate = req.body.bookingDate;
        doc.departureBusStop = req.body.departureBusStop;
        doc.departureTime = req.body.departureTime;
        doc.arrivalBusStop = req.body.arrivalBusStop;
        doc.arrivalTime = req.body.arrivalTime;
        doc.busNumber = req.body.busNumber;
        doc.itinerary = req.body.itinerary;
        doc.imageUrl = req.body.imageUrl;

        doc.save();
        
        res.status(200).send({
            status: 200,
            message: `Updated bus route successfully.`
        });
    }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: ``
        });
    });
};