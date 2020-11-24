// jshint esversion:6
// module.exports = {
//     uri: `mongodb+srv://AwayBusAdmin:${process.env.AWAYBUS_DB_PASSWORD}@awaybus-7rnrz.mongodb.net/test?retryWrites=true&w=majority`,
//     options: {
//         useUnifiedTopology: true,
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false
//     }
// };

// jshint esversion:6
const dotenv = require('dotenv');
require('dotenv').config({ path: '../'});

module.exports = {
    uri: `mongodb+srv://AwayBusAdmin:PItIyjTV0GBjlFVQ@awaybus-7rnrz.mongodb.net/test?retryWrites=true&w=majority`,
    options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
};
