const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next)=>{
    const {token }=req.cookies

    if(!token){
        return next (new ErrorHandler('Login First to Handle this resource', 401));
    }
    //user oda id decoded kulla eruku 
    const decoded = jwt.verify(token , process.env.JWT_SECRET)
    // user oda data va edukka porom
    req.user = await User.findById(decoded.id)
    next(); //req will move to next middleware

})
//authorization --> roles & permission
exports.authorizeRoles= (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next (new ErrorHandler(`Role ${req.user.role} is not allowed`,400))
        }
        next();
    }
}