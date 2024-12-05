const express = require('express');
// const cors = require('cors');
// const authMiddleware = require('../middleware/authMiddleware');
// const authenticateJWT = require('../middleware/authenticateJWT');

const app = express();
// Use CORS middleware
// app.use(cors());

async function loadApi (){
    // Middleware to parse JSON data
    app.use(express.json({ limit: '50mb' }));
    
    

    // Custom middleware to handle text/plain requests
    // app.use('/rest', restRoutes); // Login route
    // app.use('/rest/login',authMiddleware, authRoutes); // Login route
    
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });

    
}

module.exports = loadApi;