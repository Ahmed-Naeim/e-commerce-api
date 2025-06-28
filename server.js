const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

dotenv.config({path: './config/config.env'});
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');

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
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/subcategory', subCategoryRoute);
app.use('/api/v1/brand', brandRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);


// Handling undefined routes
app.all(/.*/, (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});


//handling express errors
app.use(globalError);

const server = app.listen(PORT, () => {
    console.log(`App Running on Port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`UnhandledRejection Error: ${err.name} | ${err.message}`);
    server.close(() => {
        console.log('Shutting Down')
        process.exit(1); //shutting down the app
    }); //stop the server
});