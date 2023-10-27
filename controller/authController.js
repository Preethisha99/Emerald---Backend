// authenticate related details we organize  here 
//Request Handler for Register 
const catchAsyncError = require('../Middlewares/catchAsyncError');
const { use } = require('../Routes/auth');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/errorHandler');
const SendToken = require('../utils/jwt')
const crypto = require('crypto')


// RegisterUser --> {{baseurl}}/api/v1/auth/register
exports.registerUser = catchAsyncError(async(req ,res, next)=>{
    const {name,email,password,avatar}= req.body
    const user =  await User.create({  //create function help to create document in database
            name,
            email,
            password,
            avatar
        });
        SendToken(user , 201 , res);
    // const token = user.getJwtToken(); //we will check with in this token , the user login or not
    // res.status(201).json({
    //     success: true,
    //     user,
    //     token
    //     })
})

//Loginuser --> {{baseurl}}/api/v1/auth/login
exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email , password} = req.body

    if(!email || !password){
        return next(new ErrorHandler('please enter the email & password', 400))
    }
    //finding the userDataBase
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler("invalid user or password" , 401 ))
    }
    if(! await user.isValidPassword(password)){
        return next(new ErrorHandler("invalid user or password" , 401 ))
    }

    SendToken(user , 201 , res);
})
//LogoutUser --->{{baseurl}}/api/v1/auth/logout
exports.logoutUser= (req, res,next)=>{
    res.cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    .status(200)
    .json({
        success: true,
        message: "Logged Out"
    })
}

//ForgotPassword -->{{baseurl}}/api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async(req,res, next)=>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next (new ErrorHandler('User not found with this email', 404))
    }
   const resetToken = user.getResetToken();
    await user.save({validateBeforeSave:false})

   //Create Reset URL
   const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`; //ethula http kedaikum

   const message = `Your password reset url is as follow \n\n
    ${resetUrl} \n\n If you have not requested this email , then ignore it .`
    try{
        sendEmail({
            email: user.email,
            subject: "EmeraldCart  Password Recovery",
            message
    })
    res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`
    })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message), 500)
    }
})
//ResetPassword --> {{baseurl}}/api/v1/password/reset/:token --> example ->2f4b8b9f0e5ff1586cd0cf76b09624d942472a18
//reset password API  //user oda data edukka porathunalla ethu async function nu sollurom
exports.resetPassword = catchAsyncError( async (req, res, next) => {
    const resetPasswordToken  =  crypto.createHash('sha256').update(req.params.token).digest('hex'); 
 
     const user = await User.findOne( {
        resetPasswordToken,
         resetPasswordTokenExpiry: {
             $gt : Date.now()
         }
     } )
 
     if(!user) {
         return next(new ErrorHandler('Password reset token is invalid or expired'));
     }
 
     if(req.body.password !== req.body.confirmPassword) {
         return next(new ErrorHandler('Password does not match'));
     }
 
     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordTokenExpiry = undefined;
     await user.save({validateBeforeSave: false})
     SendToken(user, 201, res)
 
 })
//User Profile related data ah edukka kudiya handler function
//Get User File  ---> {{baseurl}}/api/v1/auth/myprofile
exports.getUserProfile = catchAsyncError( async (req, res, next)=>{
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})
//Change Password  --- {{baseurl}}/api/v1/auth/password/change
exports.ChangePassword = catchAsyncError( async (req, res , next)=>{
  const user = await User.findById(req.user.id).select('+password')

  //check old Password
  if(await user.isValidPassword(req.body.oldPassword)){
    return next(new ErrorHandler(`old Password is incorrect`))
  }
  //assigning New  Password
  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    success: true,
    
  })

})
//Update Profile ---> {{baseurl}}/api/v1/auth/update
exports.updateProfile = catchAsyncError( async(req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators:true
    })
    res.status(200).json({
        success: true,
        user
    })
})
//Admin : Get All User -> {{baseurl}}/api/v1/admin/users
exports.getAllUsers = catchAsyncError( async(req,res,next)=>{
    const users  =await User.find();
    res.status(200).json({
        success: true,
        users
    })
})
//Admin : Get Specific User ---> {{baseurl}}/api/v1/admin/getuser/65059ddaf0bf6e99fb0144a2
exports.getUser = catchAsyncError( async(req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next (new ErrorHandler(`User Not Found with this id ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
  
})
// Admin : Update User ---> {{baseurl}}/api/v1/admin/updateuser/65059ddaf0bf6e99fb0144a2
exports.updateUser =catchAsyncError( async (req,res,next)=>{
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators:true
        })
        res.status(200).json({
            success: true,
            user
        })
})
//Admin:  Delete User ---> {{baseurl}}/api/v1/myorders
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
    })
})
//Admin : Get All Orders --> api/v1/orders






   

