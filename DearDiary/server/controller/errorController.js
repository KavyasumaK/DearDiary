/****************************************
 * Title: errorController
 * Intial Date: 09/07/2020
 * Summary: To handle all types of error.
 * Change 1:
 ***************************************/

const AppError = require("../utils/appError");

//DEV error handling
const sendDevError = (err,req,res)=>{
  //Response for operational error
  if(req.originalUrl.startsWith('/api')){
    return res.status(err.statusCode).json({
      type:'OPERATIONAL ERROR',
      status: err.status,
      error:err,
      message: err.message,
      stack: err.stack
    });
  }
  //Non operational Error
  return res.status(err.statusCode).json({
    type:'NON OPERATIONAL ERROR',
    status: 'Unknown',
    message: err.message
  });
}

//Production Error handling
const sendProdError = (err,req,res)=>{
  //if operations error then custom error message for each type of error else a feneric message
  let errMessage = err.isOperational?err.message:'Oops! Looks like coding Gremlins 😈 are at work. We will fix this soon.'
  res.status(err.statusCode).json({
    status: err.status,
    message: errMessage
  });
}



const handleCastErrorDB = (err)=>{
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

// {TBD: Error handled only for duplicate email in userModel. To be expanded for others}
const handleDuplicateFieldsDB = (error)=>{
  const message = `Email already exists, Please use another one to register.`;
  return new AppError(message, 400);
}

const handleValidationError = (error)=>{
  const errors = Object.values(error.errors).map(el=>el.message);
  const message = `Invalid input data: ${errors.join(', ')}`;
  return new AppError(message, 400);
}

const handleJWTError=()=>new AppError('Looks like you are logged out. Please login again.', 401);
const handleTokenExpiredError = ()=>new AppError('Looks like you are logged out. Please login again.', 401);


//Error handled based on prod or dev environemnt/ types of different errors possible.
module.exports = (err, req, res, next)=>{
  err.statusCode= err.statusCode||500;
  err.status = err.status||'Error';
  if(process.env.NODE_ENV === 'dev'){
    sendDevError(err, req, res)
  }else{
    let error = {
      ...err,
      name: err.name,
      code: err.code,
      message: err.message
    }
    //Thrown by DB when cannot case like when ID is '####' etc
    if(error.name==='CastError') error = handleCastErrorDB(error);
    //duplication errors (for example duplicate email in userModel)
    else if(error.code===11000) error = handleDuplicateFieldsDB(error);
    //Validator errors from mongoose schema
    else if(error.name === 'ValidationError') error = handleValidationError(error);
    //JWT token received is tampered 
    if(error.name === 'JsonWebTokenError') error = handleJWTError();
    if(error.name==='TokenExpiredError') error=handleTokenExpiredError();
    sendProdError(error, req, res);  
  }
}