const SendToken =(user , statusCode,res)=>{

    //creating json web token
    const token = user.getJwtToken(); 

    //Crating Cookies
    const options = {  //after 7 days cookies will expire , and remove from the client/browser
        expires:new Date(
            Date.now() + process.env.COOKIES_EXPIRES_TIME *24*60*60*1000),
            httpOnly: true
    }
      

    res.status(statusCode)
    .cookie('token' , token , options)
    .json({
        success: true,
        token,
        user
    })
}
module.exports = SendToken