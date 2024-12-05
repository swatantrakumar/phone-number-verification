const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { sendOtp, verifyOtp } = require('../service/twilioService');
const secretKey  = process.env.KEY;

class AuthController {
    static signIn = async (req, res) =>  {
        const payload = req.body;        
        try {            
            let user = await User.findOne({ email: payload.email });
            if (user) {                
                if(user.enabled){
                    if (user.validPassword(payload.password)) {                        
                        let token = this.createJwtToken({ email: payload.email });                            
                        return res.status(200).send({token:token});                        
                    }else {
                        let msg = "Password Entered is not correct";
                        return res.status(400).send({ message: msg});                        
                    }
                }else{
                    return res.status(400).send({
                        message: "User has not been verified."
                    });
                }
            }else {
                return res.status(400).send({
                    message: "User not Registered."
                });
            }
        } catch (error) {
            console.log("login error" + error);
        }       
    }    
    static signUp = async (req, res) => {
        const signUpRequest = req.body;
        if (await this.userExists(signUpRequest.email.toLowerCase())) {            
            return res.status(400).send({message: "This Email is already registerd."});            
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
            return res.status(200).send({message : "User registered successfully"}); 
        } catch (error) {
            return res.status(400).send({
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
        const emailExists = await User.findOne({ email: userId});
        return emailExists;
    }
    static mobileVerify = async (req,res) =>{
        console.log(req.body);
        console.log(req.user);f
        return res.status(400).send({msg:"OTP send on your Mobile Number!!!"});
    }
}

module.exports = AuthController;