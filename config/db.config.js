// jshint esversion:6
module.exports = {
    uri: `mongodb+srv://AwayBusAdmin:${process.env.AWAYBUS_DB_PASSWORD}@awaybus-7rnrz.mongodb.net/test?retryWrites=true&w=majority`,
    options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
};
