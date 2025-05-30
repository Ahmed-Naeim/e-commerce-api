const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({path: './config/config.env'});
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');

// Connect to database
dbConnection();

const PORT = process.env.PORT || 8000;
// Load environment variables from .env file

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for logging HTTP requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mounting routes
app.use('/api/v1/category', categoryRoute);

app.listen(PORT, () => {
    console.log(`App Running on Port ${PORT}`)
});