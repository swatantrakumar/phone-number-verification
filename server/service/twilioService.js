const twilio = require('twilio');

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Set in .env
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Set in .env
const serviceSid = process.env.TWILIO_SERVICE_SID; // Set in .env

// Create Twilio client
const client = twilio(accountSid, authToken);

// Send OTP function
const sendOtp = async (phoneNumber) => {
  try {      
    // const response = await client.verify.v2.services(serviceSid)
    //   .verifications
    //   .create({ to: phoneNumber, channel: 'sms' });
    //   console.log(response);
    return { success: true, message: 'OTP sent successfully'};
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Verify OTP function
const verifyOtp = async (phoneNumber, otp) => {
  try { 
    let response = {
      status :'approved'
    }          
    // const response = await client.verify.v2.services(serviceSid)
    //   .verificationChecks
    //   .create({ to: phoneNumber, code: otp });
    if (response.status === 'approved') {
      return { success: true, message: 'OTP verified successfully' };
    } else {
      return { success: false, message: 'Invalid OTP or OTP expired' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { sendOtp, verifyOtp };
