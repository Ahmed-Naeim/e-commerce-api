const mongoose = require('mongoose');
const dbConnection  = () => {
    mongoose.connect(process.env.DB_URI).then((conn) => {
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }).catch(err => {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1); // Exit the process with failure
    });
}

module.exports = dbConnection;