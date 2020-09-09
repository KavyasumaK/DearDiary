/****************************************
 * Title: App.js
 * Intial Date: 09/06/2020
 * Summary: Server and req sanitization.
 * Change 1: Added Global Error Handler
 ***************************************/
const express = require('express');

const userRouter = require('./routes/userRoute');
const globalErrorHandler = require('./controller/errorController');

const app = express();

//MIddleware to serve Static files
// app.use(express.static(`${__dirname}/Public`));

//Middleware To parse req.body
app.use(express.json());
// {TBD Sanitize}

//Router level middleware
app.use('/api/v1/users', userRouter);

//{TBD unhandled Routes}

//Global Error Handler
app.use(globalErrorHandler);
module.exports= app;