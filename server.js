const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

dotenv.config({path: './config/config.env'});
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');

// Importing routes
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const reviewRoute = require('./routes/reviewRoute');

// Connect to database
dbConnection();

const PORT = process.env.PORT || 8000;
// Load environment variables from .env file

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware for CORS
app.use(cors());
// Middleware for compression
app.use(compression());

// Middleware for logging HTTP requests
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mounting routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auths', authRoute);
app.use('/api/v1/reviews', reviewRoute);


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