const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController');

// signIn route
router.post('/signIn', AuthController.signIn);
// signUp route
router.post('/signUp', AuthController.signUp);

//Send Otp
router.post('/send-otp', AuthController.sendOpt);
//Verify Opt
router.post('/verify-otp', AuthController.verifyOtp);



module.exports = router;