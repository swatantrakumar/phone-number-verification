const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { sendOtp, verifyOtp } = require('../service/twilioService');
const secretKey  = process.env.KEY;

class AuthController {
    static signIn = async (req, res) =>  {
        const payload = JSON.parse(atob(req.body));        
        try {            
            let user = await User.findOne({ email: payload.email });
            if (user) {                
                if(user.enabled){
                    if (user.validPassword(payload.password)) {                        
                        let token = this.createJwtToken({ email: payload.email });                            
                        return res.status(200).send({success:true,token:token,user:user});                        
                    }else {
                        let msg = "Password Entered is not correct";
                        return res.status(400).send({success:false, message: msg});                        
                    }
                }else{
                    return res.status(400).send({
                        success:false,
                        message: "User has not been verified."
                    });
                }
            }else {
                return res.status(400).send({
                    success:false,
                    message: "User not Registered."
                });
            }
        } catch (error) {
            console.log("login error" + error);
        }       
    }    
    static signUp = async (req, res) => {
        const signUpRequest = JSON.parse(atob(req.body));
        if (await this.userExists(signUpRequest.email.toLowerCase())) {            
            return res.status(400).send({success:false,message: "This Email is already registerd."});            
        }      

        // Creating empty user object
        let newUser = new User();

        // Initialize newUser object with request data    
        newUser.createdBy = signUpRequest.email;
        newUser.createdByName = signUpRequest.name;
        newUser.name = signUpRequest.name;
        newUser.email = signUpRequest.email;
        newUser.mobileNumber = signUpRequest.mobileNumber;
        newUser.enabled = true;  
        newUser.accountStatus = "Active"
        
    
        // Call setPassword function to hash password
        newUser.setPassword(signUpRequest.password); 

        // Save newUser object to database
        try {
            await newUser.save();
            return res.status(200).send({success:true,message : "User registered successfully"}); 
        } catch (error) {
            return res.status(400).send({
                success:false,
                message: "Failed to add user."
            });           
        }      
    }
    static createJwtToken(payload) {
        // Generate JWT token
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
        return token;
    }
    static async userExists(userId){        
        const emailExists = await this.getUser(userId);
        return emailExists;
    }
    static sendOpt = async (req,res) => {
        const payload = req.body;

        const result = await sendOtp("+91"+payload.mobileNumber);
        // Note: Twilio's Verify API does not support custom expiration times directly.
        //       Instead, we are storing the OTP sent timestamp and expiration time in the database.
        //       Before verifying the OTP, we check if the OTP has expired.
        // TODO: If Twilio updates their API to support custom expiration times, refactor this logic accordingly.
        if(result.success){
            const email = req.user.email;
            const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes from now
            try {
                await User.updateOne(
                    { email: email }, 
                    { $set: { expireAt: expiresAt } },  
                    { upsert: false }           
                  ); 
            } catch (error) {
                console.log(error);
            }       
        }        
        res.status(200).send(result);
    }
    static verifyOtp = async (req,res) => {
        const payload = req.body;
        const email = req.user.email;
        const user = await this.getUser(email);
        // Note: Twilio's Verify API does not support custom expiration times directly.
        //       Instead, we are storing the OTP sent timestamp and expiration time in the database.
        //       Before verifying the OTP, we check if the OTP has expired.
        // TODO: If Twilio updates their API to support custom expiration times, refactor this logic accordingly.
        if(Date.now() > user.expireAt){
            res.status(500).send({ success: false, message: 'OTP expired' });
        }else{
            const result = await verifyOtp("+91"+payload.mobileNumber, payload.code); 
            if(result.success){
                try {
                    await User.updateOne(
                        { email: email }, 
                        { $set: { expireAt: null,isMobileVerified:true } },  
                        { upsert: false }           
                      );
                } catch (error) {
                    console.log(error);  
                } 
            }   
            result.user = await this.getUser(email);      
            res.status(200).send(result);
        }        
    }
    static async getUser(userId){
        return await User.findOne({ email: userId }).select('name email mobileNumber enabled isMobileVerified')
    }
}

module.exports = AuthController;