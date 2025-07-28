const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const cors = require('cors');
const compression = require('compression');

dotenv.config({path: './config/config.env'});
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');

// Importing routes
const mountRoutes = require('./routes');

// Connect to database
dbConnection();

const PORT = process.env.PORT || 8000;
// Load environment variables from .env file

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware for CORS
app.use(cors());
// Middleware for compression to reduce response size
app.use(compression());


// // Checkout webhook
// app.post(
//     '/webhook-checkout',
//     express.raw({ type: 'application/json' }),
//     webhookCheckout
// );

// Middleware for logging HTTP requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mounting routes
mountRoutes(app);

// Handling undefined routes
app.all(/.*/, (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});


//handling express errors
app.use(globalError);

const server = app.listen(PORT,'0.0.0.0' , () => {
    console.log(`App Running on Port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`UnhandledRejection Error: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log('Shutting Down')
        process.exit(1); //shutting down the app
    }); //stop the server
});