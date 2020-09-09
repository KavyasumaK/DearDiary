/****************************************
 * Title: catchAsync
 * Intial Date: 09/07/2020
 * Summary: DRY: wrapping all async functions in the project with catchAync anonymous function so that it doesn't execute immediately but when it is executed the error is caught and passed on to the next middleware (global error handler most of the times).
 ***************************************/

module.exports = (fn)=>{
  return (req,res,next)=>{
    fn(req,res,next).catch(next);
  }
}