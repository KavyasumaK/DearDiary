/****************************************
 * Title: appError
 * Intial Date: 09/07/2020
 * Summary: Add custom additions to the error stack.
 * Change 1:
 ***************************************/

 class AppError extends Error{
   constructor(message,statusCode){
     super(message);
     this.statusCode=statusCode;
     this.status = `${statusCode}` .startsWith('4')?'Fail':'Error';
     //Since we are calling this class only for known operational errors.
     this.isOperational = true;
     //TO capture complete stack trace
     Error.captureStackTrace(this, this.constructor);
   }
 }

 module.exports = AppError;