const express = require('express');
const { getConnection, testConnection } = require('./Database/connect');

const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
require('express-async-errors');

// Import routers
const adminRoutes = require('./Routes/admin');
const loginRouter = require('./Routes/login');
const studentRouter = require('./Routes/student');
const cantFindMiddleware = require('./Middleware/cantFind');

const app = express();

// Security-related middlewares should be set up at the beginning
app.use(helmet());
app.use(cors());  // CORS policy to allow cross-origin requests

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 50  // limit each IP to 50 requests per windowMs
});
app.use(limiter);

// Built-in middleware function in express that parses incoming requests with JSON payloads
app.use(express.json());

// Setting up API routes
app.use('/api', adminRoutes);
app.use('/api', loginRouter);
app.use('/api', studentRouter);

// Middleware for 404 not found errors
//app.use(cantFindMiddleware);

// Start the server
const port = 5173;
async function startServer() {
    try {
        // Test database connection
        await testConnection();
        console.log('Database connection successful');

        // Start listening for requests
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
}

// Call the startServer function to boot up your application
startServer();