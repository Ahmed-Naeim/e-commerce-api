const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({path: './config/config.env'});
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware')
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

//error handling for API
app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

//handling express errors
app.use(globalError);

const server = app.listen(PORT, () => {
    console.log(`App Running on Port ${PORT}`)
});

process.on('unhandledRejection', (err) =>{
    console.log(`UnhandledRejection Error: ${err.name} | ${err.message}`);
    server.close(()=>{
        console.log('Shutting Down')
        process.exit(1); //shutting down the app
    }); //stop the server
});