const mongoose = require('mongoose');

const {dbConnection} = require("../config/environment");

//DB config
const dbConfig = dbConnection;

//Connect to Mongo
mongoose.connect(dbConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected...');

})
.catch((err) => console.log(err, " :DB connect Error"));