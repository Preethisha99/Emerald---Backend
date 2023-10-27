const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const sha256 = require('sha256');
const { createHash } = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: "String",
            required: [true , 'please enter the name']

        },
        email:{
            type:"String",
            required: [true, 'please enter the email'],
            unique: true,
            validate: [validator.isEmail, 'please enter valid email address']
        },
        password:{
            type:"String",
            require: [true , 'please enter the password'],
            maxLength: [6, "password cannot exceed 6 character"],
            select : false
        },
        avatar:{
            type:"String",
            
        },
        role:{
            type:"String",
            default: 'user'
        },
        resetPasswordToken:{
            type:"String"
        },
        resetPasswordTokenExpiry:{
            type:Date
        },
        createdAt:{
            type: Date,
            default: Date.now
        }
    }
)
//HASHING PASSWORD 
            // it will call advanced
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password =await bcrypt.hash(this.password , 10 )
})
//GETJWT_TOKEN
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this.id} , process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}
//compare the password 
userSchema.methods.isValidPassword = async function(EnteredPassword){
    return await bcrypt.compare(EnteredPassword, this.password)
}
// crypto  ---> Reset Password
userSchema.methods.getResetToken = function(){
     //Generate Token
    var token =crypto.randomBytes(20).toString('hex'); //buffer data (num +alp) meaning ->digital data  mixing of alphabet and num
    //Generate hash and set to resetPasswordToken
    sha256('token');
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    //set Toke expire time
    this.resetPasswordTokenExpiry= Date.now() + 30*60*1000
    return token
}

let model = mongoose.model('User' ,  userSchema)

module.exports = model;