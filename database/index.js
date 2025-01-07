const mongoose = require('mongoose');

//DB config
const dbConfig = process.env.PRODUCTION_MODE ? process.env.altaURI : localURI;

//Connect to Mongo
mongoose.connect(dbConfig)
.then(() => {
    console.log('MongoDB Connected...');
})
.catch((err) => console.log(err, " :DB connect Error"));