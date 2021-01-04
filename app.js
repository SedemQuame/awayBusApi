// jshint esversion: 6
/**Author: Sedem Quame Amekpewu
 * Date: Sunday, 31st May, 2019
 * Project Title: Away Bus
 * Description: Away Bus, is vehicle booking system.
 *               data for analytics purposes.
 **/

// ===================================== requiring modules ===================================== //
// node modules
const express = require(`express`);
const mongoose = require(`mongoose`);
const bodyParser = require(`body-parser`);
const dotenv = require(`dotenv`);
const session = require(`express-session`);
const MongoDBStore = require('connect-mongodb-session')(session);

// ================================== express app configurations ==================================== //
//creating app
const app = express();

// ========================================== configure environment variables  ========================================== //
if(!process.env.MODE){
    const result = dotenv.config({path: `./config/.env`});
    if (result.error) {
        // throw result.error;
        app.use(function(req, res){
            res.status(404).render('connectionErr.ejs', {loggedIn: false});
        });
    }
}

// custom modules
const db = require(`./config/db.config`);

const store = new MongoDBStore({
    uri: db.uri,
    collection: `sessions`,
    expires: 1000 * 60 * 60 * 24 * 7 // 1 week
});

// creating video routes
const router = express.Router();

// passing router to app
app.use(router);
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// plug express session as part of middleware
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store
}));

// serving static files in express
app.use(express.static(__dirname));
app.use(express.static(`public`));

// ====================================== db configurations ========================================= //
mongoose.Promise = global.Promise;

const connectDB = async() => {
    await mongoose.connect(db.uri, db.options).catch((err) => {
        console.log(`Connection timed out.`);
        console.log(`Err: ${err.stack}`);
        app.use(function(req, res) {
            res.status(404).render('connectionErr.ejs', { loggedIn: false });
        });
    }).then(() => {
        console.log(`DB Connected....`);
    });
};
connectDB();

//====================================== registering required routes ========================================//
require(`./routes/bus.routes`)(app);
require(`./routes/staff.routes`)(app);
require(`./routes/route.routes`)(app);
require(`./routes/driver.routes`)(app);
require(`./routes/coupon.routes`)(app);
require(`./routes/passenger.routes`)(app);
require(`./routes/page_render.routes`)(app);

// ========================================== app routes ============================================ //
app.all(`/`, (req, res) => {
    res.send({msg: `Welcome to Away Bus.`});
});

// if the given route is not available print an err.
app.use(function(req, res) {
    res.status(404).send({message: "Route not found"}, { loggedIn: false });
});

// ====================================== app listening port ======================================== //
let port = process.env.PORT||8075;
app.listen(port, function() {
    console.log(`app started on port: ${port}`);
    console.log(`Open app on http://localhost:8075/`);
});
