const express = require('express');
const {StatusCodes} = require('http-status-codes')

const cookieParser = require('cookie-parser');

const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
require('express-async-errors');

// Import routers
const adminRoutes = require('./Routes/admin');
const authRoutes = require('./Routes/auth');
const studentRoutes = require('./Routes/student');
const cantFindMiddleware = require('./Middleware/cantFind');

const app = express();

// Security-related middlewares should be set up at the beginning
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173' // Your React app's running port
}));  // CORS policy to allow cross-origin requests

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5000  // limit each IP requests per windowMs
});
app.use(limiter);

// Built-in middleware function in express that parses incoming requests with JSON payloads
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

// Setting up API routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

// Middleware for 404 not found errors
app.use(cantFindMiddleware);

// Start the server
const port = 3000;

app.use((err,req,res,next) =>{
    console.log(err.stack);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something broke.');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});