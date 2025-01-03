const mongoose = require('mongoose');

//DB config
const dbConfig = process.env.dbConnection;

//Connect to Mongo
mongoose.connect(dbConfig, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected...');

})
.catch((err) => console.log(err, " :DB connect Error"));