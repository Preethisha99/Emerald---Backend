module.exports = (err,req, res, next) =>{
    err.statuscode = err.statuscode || 500; //internal server error code 

    if(process.env.NODE_ENV == "development")  {
    res.status(err.statuscode).json({
        success: false, //error response
        message: err.message,
        stack: err.stack, //yentha file la error erukunu pakka help pannum stack
        error: err
    })
}
    if(process.env.NODE_ENV == "production"){
        let message = err.message;
        let error = new Error(message); //spread operator , (error obj kulla erukura ellathaum kondu varathuku spread op use pannurom)

        if(err.name == "ValidationError"){
            message = Object.values(err.errors).map(value => value.message)
            error = new Error(message)
            err.statuscode = 400
        }
        if(err.name == "CastError"){
            message = `Resource Not Found: ${err.path}`;
            error = new Error(message)
            err.statuscode = 400
        }
        if(err.code == 11000){
            let message = `Duplicate ${Object.keys(err.keyValue)} error`
            error = new Error(message)
            err.statuscode = 400
        }
        if(err.name == "JSONWebTokenError"){
            let message = `JSON Web Token is invalid. Try again`
            error = new Error(message)
            err.statuscode = 400
        }
        if(err.name == "TokenExpiredError"){
            let message = `JSON Web Token is expired. Try again`
            error = new Error(message)
            err.statuscode = 400
        }
        res.status(err.statuscode).json({
            success: false, //error response
            message: error.message || 'Internal Server Error'
            // message //for checking purpose
            
        }) 
    }
}