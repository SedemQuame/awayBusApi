// jshint esversion:6
// ===================== node modules ======================
const _ = require('lodash');
const spawn = require('spawn-password');
const dotenv = require('dotenv');
dotenv.config({
    path: './.env'
});

// MAIL_PROVIDERS
// 1. SendGrid Mail
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 2. MailGun Mail
const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });

// =================== custom modules ======================
const routes = require(`../models/route.models`);
const coupon = require(`../models/coupon.models`);
const bus = require(`../models/bus.models`);
const passenger = require(`../models/passenger.models`);

// exports
exports.createBusRoute = (req, res) => {
    let spawned_password = spawn.spawn();
    // Get bus row and cols using number plate here.
    bus.findOne({ busNumberPlate: req.body.licenseNumber }).then((doc) => {
        // creating object to store seating arrangement
        // todo: change user arrangements from multi-dimensional to linear representation.

        // let seatRows = doc.seatArrangement.rows;
        // let seatCols = doc.seatArrangement.cols;
        let parentArr = [];
        let seatingCapacity = doc.busSeatingCapacity;
        // let counter = 1;
        // for (let i = 0; i < seatRows; i++) {
        //     let childArr = []
        //     for (let j = 0; j < seatCols; j++) {
        //         let seat = {};
        //         seat.value = 'RC:' + i + '-' + j;
        //         seat.booked = false;
        //         childArr.push(seat);
        //         counter += 1;
        //         if (counter > seatingCapacity) {
        //             break;
        //         }
        //     }
        //     parentArr.push(childArr);
        //     if (counter > seatingCapacity) {
        //         break;
        //     }
        // }

        for (let i = 1; i <= seatingCapacity; i++) {
            let seat = {};
            seat.value = String(i);
            seat.booked = false;
            parentArr.push(seat);
        }

        routes.create({
            busNumberPlate: req.body.licenseNumber.toUpperCase(),
            busCapacity: doc.busSeatingCapacity,
            departurePoint: req.body.departurePoint.toLowerCase(),
            arrivalPoint: req.body.arrivalPoint.toLowerCase(),
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            departureDate: req.body.departureDate,
            farePerPerson: req.body.busFare,
            state: 'Pending',
            // ====================================================
            pickUpPoints: (req.body.pickUpPoints).split(','),
            dropOffPoints: (req.body.dropOffPoints).split(','),
            busTerminal: req.body.busTerminal,
            // ====================================================
            applicableCouponCode: req.body.selectedCoupons,
            // ====================================================
            seatArrangement: {
                // rows: seatRows,
                // cols: seatCols,
                arrangementMatrix: parentArr,
            },
            username: spawned_password,
        }).then(() => {
            res.redirect(`/routes`);
        }).catch((err) => {
            res.status(404).send({
                status: 404,
                error: err,
                message: `Unable to create a bus route.`
            });
        });
    }).catch(err => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Selected Bus Does Not Exist`,
        })
    });
};

exports.deleteRoute = (req, res) => {
    routes.findByIdAndDelete({ _id: req.params.routeId })
        .then(() => {
            res.status(200).send({
                status: 200,
                msg: `Deleted bus route successfully.`
            });
        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            msg: `Unable to delete bus route.`
        });
    });
};

exports.getRoutes = (req, res) => {
    routes.find({})
        .then((routes) => {
            bus.find({}).then((buses) => {
                res.render(`${__dirname}/../views/staff/pathways.views.ejs`, {
                    routes: routes,
                    buses: buses,
                    message: `Returned all bus routes successfully.`,
                    staffInfo: req.session.staff,
                });
            }).catch(() => {
                res.render(`${__dirname}/../views/staff/pathways.views.ejs`, {
                    routes: routes,
                    buses: [],
                    message: `Unable to return routes.`,
                    staffInfo: req.session.staff,
                });
            });
        }).catch(() => {
        res.render(`${__dirname}/../views/staff/pathways.views.ejs`, {
            routes: [],
            buses: [],
            message: `Unable to return routes.`,
            staffInfo: req.session.staff,
        });
    });
};

exports.getAllBusRoutes = (req, res) => {
    routes.find({})
        .then((docs) => {
            res.render(`${__dirname}/../views/routes.views.ejs`, {
                possibleRoutes: docs,
                loggedIn: req.session.isLoggedIn,
                query: {
                    departurePoint: '',
                    arrivalPoint: '',
                    departureTime: '',
                    arrivalTime: '',
                },
                user: req.session.user,
            });
        }).catch((err) => {
        res.status(404).send({
            status: 404,
            error: err,
            message: `Unable to get all bus routes.`
        });
    });
};

exports.getRouteById = (req, res) => {
    routes.findById({ _id: req.params.routeId })
        .then((doc) => {
            bus.findOne({ busNumberPlate: (doc.busNumberPlate).toUpperCase() }).then(buses => {
                res.send({
                    status: 200,
                    route: doc,
                    buses: buses,
                    message: `Returned bus route successfully.`
                });
            }).catch(err => {
                res.status(404).send({
                    status: 404,
                    error: err,
                    message: ``
                });
            });
        }).catch((err) => {
        res.send({
            status: 404,
            error: err,
            message: `Unable to get all bus route`
        });
    });
};

exports.updateRoute = (req, res) => {
    routes.findByIdAndUpdate({ _id: req.body.Id })
        .then((doc) => {
            doc.bookingDate = req.body.bookingDate;
            doc.departureBusStop = req.body.departureBusStop;
            doc.departureTime = req.body.departureTime;
            doc.arrivalBusStop = req.body.arrivalBusStop;
            doc.arrivalTime = req.body.arrivalTime;
            doc.busNumber = req.body.busNumber;
            doc.itinerary = req.body.itinerary;
            doc.imageUrl = req.body.imageUrl;
            // ====== save updated doc ============
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

exports.searchRoutes = (req, res) => {
    routes.find({
        departurePoint: (req.query.departurePoint).toLowerCase()
    }).then(docs => {
        res.render(`${__dirname}/../views/routes.views.ejs`, {
            possibleRoutes: docs,
            loggedIn: req.session.isLoggedIn,
            query: req.query,
            user: req.session.user,
        });
    }).catch(() => {
        res.render(`${__dirname}/../views/routes.views.ejs`, {
            possibleRoutes: [],
            loggedIn: req.session.isLoggedIn,
            query: req.query,
            user: req.session.user,
        });
    });
};

exports.queryFromTerm = (req, res) => {
    routes.find({
        departurePoint: { $regex: req.params.term, $options: "i"}
    }).select(`departurePoint`).then(terms => {
        res.send({
            listOfTerms: terms
        });
    }).catch(() => {
        res.send({
            listOfTerms: ['Route not found']
        });
    });
};

exports.queryToTerm = (req, res) => {
    routes.find({
        arrivalPoint: { $regex: req.params.term, $options: "i"}
    }).select(`arrivalPoint`).then(terms => {
        res.send({
            listOfTerms: terms
        });
    }).catch(() => {
        res.send({
            listOfTerms: ['Route not found']
        });
    });
};

function luggage(state) {
    if (state == 'on') return 'yes';
    return 'no';
}

exports.selectSeatAndCheckOut = (req, res) => {
    let seats = (req.body.selectedSeat).split(',');
    routes.findOne({
        _id: req.body.route_id
    }).then((doc) => {
        seats.forEach(seat => {(doc.seatArrangement.arrangementMatrix[parseInt(seat)]).booked = true;
        });
        routes.findByIdAndUpdate(
            req.body.route_id, {
                seatArrangement: {
                    rows: doc.seatArrangement.rows,
                    cols: doc.seatArrangement.cols,
                    arrangementMatrix: doc.seatArrangement.arrangementMatrix
                }
            }, () => {
                passenger.findOneAndUpdate({
                    _id: req.session.user_id
                }, {
                    $push: {
                        bookings: {
                            bus_id: req.body.bus_id,
                            route_id: req.body.route_id,
                            seats: req.body.selectedSeat,
                            journey: `${doc.departurePoint} to ${doc.arrivalPoint}`,
                        }
                    }
                }).then(async() => {
                    let ticketNumber = (doc.departurePoint[0] + doc.arrivalPoint[0] + '-' + Math.floor((Math.random() * 100000) + 1)).toUpperCase();
                    let emailAddress = '';
                    (req.session.user.emailAddress === undefined) ? emailAddress = '1' : emailAddress = '2';
                    const msg = {
                        from: 'sedem.amekpewu@turntabl.io',
                        to: emailAddress,
                        subject: 'AwayBus Ticket',
                        text: 'Hi, user below is the ticket for trip you booked on the AwayBus system.',
                        html: `
                            <html style="box-sizing: border-box;font-family: sans-serif;line-height: 1.15;-webkit-text-size-adjust: 100%;-webkit-tap-highlight-color: transparent;">
  <head style="box-sizing: border-box;">
    <title style="box-sizing: border-box;"></title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous" style="box-sizing: border-box;">
  </head>
  <body style="box-sizing: border-box;margin: 0;font-family: -apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Arial,&quot;Noto Sans&quot;,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;,&quot;Segoe UI Symbol&quot;,&quot;Noto Color Emoji&quot;;font-size: 1rem;font-weight: 400;line-height: 1.5;color: #212529;text-align: left;background-color: #fff;min-width: 992px!important;">
      <div style="width: 60%;margin-left: 20%;box-sizing: border-box;">
          <h1 class="text-center" style="box-sizing: border-box;margin-top: 0;margin-bottom: .5rem;font-weight: 500;line-height: 1.2;font-size: 2.5rem;text-align: center!important;">Thank You</h1>
          <p class="text-muted text-center" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-align: center!important;color: #6c757d!important;">For Booking With AwayBus</p>
          <hr style="box-sizing: content-box;height: 0;overflow: visible;margin-top: 1rem;margin-bottom: 1rem;border: 0;border-top: 1px solid rgba(0,0,0,.1);">
          <h5 class="card-header bg-dark text-center" style="box-sizing: border-box;margin-top: 0;margin-bottom: 0;font-weight: 500;line-height: 1.2;font-size: 1.25rem;padding: .75rem 1.25rem;background-color: #343a40!important;border-bottom: 1px solid rgba(0,0,0,.125);text-align: center!important;">
              <strong class="text-white" style="box-sizing: border-box;font-weight: bolder;color: #fff!important;">AWAYBUS</strong>
          </h5>
          <table class="table" style="box-sizing: border-box;border-collapse: collapse!important;width: 100%;margin-bottom: 1rem;color: #212529;">
                <tbody style="box-sizing: border-box;">
                  <tr style="box-sizing: border-box;page-break-inside: avoid;">
                    <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                          <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">From</p>
                          <p class="ticker-subheader text-capitalize text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-transform: capitalize!important;color: #6c757d!important;">
                              ${doc.departurePoint}
                          </p>
                    </td>
                    <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                      <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">To</p>
                          <p class="ticker-subheader text-capitalize text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-transform: capitalize!important;color: #6c757d!important;">
                              ${doc.arrivalPoint}
                          </p>
                    </td>
                  </tr>
                  <tr style="box-sizing: border-box;page-break-inside: avoid;">
                    <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                      <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">Date</p>
                          <p class="ticker-subheader text-capitalize text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-transform: capitalize!important;color: #6c757d!important;">
                              ${doc.departureDate}
                          </p>
                    </td>
                    <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                       <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">Time</p>
                          <p class="ticker-subheader text-capitalize text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-transform: capitalize!important;color: #6c757d!important;">
                              ${doc.departureTime}
                          </p>
                    </td>
                  </tr>
                  <tr style="box-sizing: border-box;page-break-inside: avoid;">
                    <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                          <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">License</p>
                          <p class="ticker-subheader text-capitalize text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-transform: capitalize!important;color: #6c757d!important;">
                              ${doc.busNumberPlate}
                          </p>
                    </td>
                    <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                          <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">Luggage</p>
                          <p class="ticker-subheader text-capitalize text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-transform: capitalize!important;color: #6c757d!important;">
                              ${luggage(req.body.luggageState)}
                          </p>
                    </td>
                  </tr>
                  <tr style="box-sizing: border-box;page-break-inside: avoid;">
                    <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                          <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">Ticket Number</p>
                          <p class="ticker-subheader text-capitalize text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-transform: capitalize!important;color: #6c757d!important;">
                              ${ticketNumber}
                          </p>
                    </td>
                    <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                          <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">Paid Amount</p>
                          <p class="ticker-subheader text-capitalize text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-transform: capitalize!important;color: #6c757d!important;">
                           ${req.body.totalFare}c
                          </p></td>
                  </tr>
                  <tr style="box-sizing: border-box;page-break-inside: avoid;">
                    <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                          <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">Booked Seat(s)</p>
                          <p class="ticker-subheader text-capitalize text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-transform: capitalize!important;color: #6c757d!important;">
                              ${req.body.selectedSeat}
                          </p>
                    </td>
                  </tr>
                  <tr style="box-sizing: border-box;page-break-inside: avoid;">
                      <td style="box-sizing: border-box;padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;background-color: #fff!important;">
                          <p class="ticker-header" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;">awaybus.com</p>
                          <p class="text-center text-muted" style="box-sizing: border-box;margin-top: 0;margin-bottom: 1rem;orphans: 3;widows: 3;text-align: center!important;color: #6c757d!important;">Easier, Comfortable Transport</p>
                      </td>
                  </tr>
                </tbody>
              </table>
      </div>
  </body>
  </html>
                        `
                    };

                    await mailgun.messages().send(msg).then(() => {
                        req.session.ticketData = {
                            message: {
                                status: `alert-success`,
                                primary: `Please check your mail for, a copy of your ticket.`,
                                secondary: `or, click the button below to print your ticket.`
                            },
                            selectedSeat: req.body.selectedSeat,
                            loggedIn: req.session.isLoggedIn,
                            newAccount: false,
                            failedSignup: false,
                            ticketData: {
                                routeId: req.body.route_id,
                                seat: req.body.selectedSeat,
                                numberPlate: doc.busNumberPlate,
                                departurePoint: doc.departurePoint,
                                arrivalPoint: doc.arrivalPoint,
                                departureTime: doc.departureTime,
                                departureDate: doc.departureDate,
                                luggageState: luggage(req.body.luggageState),
                                fare: req.body.totalFare,
                                ticketNumber: ticketNumber,
                                couponCode: req.body.couponCode,
                            },
                            user: req.session.user,
                        };
                    }).catch((err) => {
                        console.log(err);
                        req.session.ticketData = {
                            message: {
                                status: `alert-danger`,
                                primary: `Unable to send a copy of the ticket to your email address.`,
                                secondary: `Please print the ticket by clicking the button below.`,
                            },
                            selectedSeat: req.body.selectedSeat,
                            loggedIn: req.session.isLoggedIn,
                            newAccount: false,
                            failedSignup: false,
                            ticketData: {
                                routeId: req.body.route_id,
                                seat: req.body.selectedSeat,
                                numberPlate: doc.busNumberPlate,
                                departurePoint: doc.departurePoint,
                                arrivalPoint: doc.arrivalPoint,
                                departureTime: doc.departureTime,
                                departureDate: doc.departureDate,
                                luggageState: luggage(req.body.luggageState),
                                fare: req.body.totalFare,
                                ticketNumber: ticketNumber,
                                couponCode: req.body.couponCode,
                            },
                            user: req.session.user,
                        };
                    });

                    // rewrite users obj into session.
                    await passenger.findById(req.session.user_id).then((user) => {
                        req.session.user = user;
                        res.redirect(`/ticket`);
                    }).catch(() => {
                        res.redirect(`/ticket`);
                    });
                }).catch(err => {
                    console.log(err);
                    res.redirect(`/ticket`);
                });
            });
    });
};

exports.printTicket = (req, res) => {
    console.log(req.session.ticketData);
    // res.render(`${__dirname}/../views/checkout.views.ejs`, {
    //     // user: req.session.user,
    //     loggedIn: req.session.isLoggedIn,
    //     ...req.session.ticketData
    // });
};

exports.updateTripState = (req, res) => {
    routes.findByIdAndUpdate(req.params.tripId, { state: req.params.state }).then(() => {
        res.json({
            success: true,
        });
    }).catch(() => {
        res.json({
            success: false,
        });
    });
};

exports.validateCoupon = (req, res) => {
    routes.findOne({ _id: req.params.routeId }).then(route => {
        coupon.findById(route.applicableCouponCode).then(coupon => {
            if (coupon.generatedCode == req.params.couponId) {
                res.send({ validity: true, coupon });
            } else {
                res.send({ validity: false, });
            }
        });
    }).catch(err => {
        console.log(err);
        res.send({ validity: false });
    });
};