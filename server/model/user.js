// Importing modules
const mongoose = require('mongoose');
const crypto = require('crypto');
const BaseEntity = require("./baseEntity");
 
// Creating user schema
const UserSchema = mongoose.Schema({
    ...BaseEntity.schema.obj,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    user: String,
    hash: String,
    salt: String,    
    mobileNumber:String,
    verificationCode:String,
    enabled:{type:Boolean},
    expireAt:Number,
    isMobileVerified: { type: Boolean, default: false },
    accountStatus:String,
});
 
// Method to set salt and hash the password for a user
UserSchema.methods.setPassword = function (password) {
 
    // Creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex'); 
    
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};
 
// Method to check the entered password is correct or not
UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};


 
// Combine the base entity schema with the user schema
const User =  mongoose.model('User', UserSchema,'app_user');

module.exports = User;