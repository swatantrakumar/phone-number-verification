const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController');

// signIn route
router.post('/signIn', AuthController.signIn);
// signUp route
router.post('/signUp', AuthController.signUp);


module.exports = router;