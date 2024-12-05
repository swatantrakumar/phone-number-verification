const express = require('express');
const cors = require('cors');
const authRoutes = require('../routes/authRoutes');
const authenticateJWT = require('../middleware/authenticateJWT');
const AuthController = require('../controller/authController');

const app = express();

// Use CORS middleware
app.use(cors());

async function loadApi (){  
    app.use(express.json())  

    app.use('/auth', authRoutes); // Login route
    app.use('/mobile', authenticateJWT, authRoutes) // Mobile Number Verification

    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    
}

module.exports = loadApi;