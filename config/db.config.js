// jshint esversion:6
const dotenv = require('dotenv');
require('dotenv').config({ path: '../'});

module.exports = {
    url: `mongodb+srv://AwayBusAdmin:PItIyjTV0GBjlFVQ@awaybus-7rnrz.mongodb.net/test?retryWrites=true&w=majority`,
    options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
};


// uname: AwayBusAdmin
// pwsd:  PItIyjTV0GBjlFVQ


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://AwayBusAdmin:<password>@awaybus-7rnrz.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
