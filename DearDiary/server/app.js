/****************************************
 * Title: App.js
 * Intial Date: 09/06/2020
 * Summary: Server and req sanitization.
 * Change 1: Added Global Error Handler
 * change2: 09/10/2020 added general cors implementation and cookie parser
 * change3: 09/19/2020 added friends router
 ***************************************/
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoute');
const diaryEntryRouter = require('./routes/diaryEntryRoute');
const friendsRouter = require('./routes/friendsRoute');
const commentRouter = require('./routes/commentRoute');
const globalErrorHandler = require('./controller/errorController');

const app = express();

//MIddleware to serve Static files
// app.use(express.static(`${__dirname}/Public`));

//{TBD change cors to include specific IPs}
app.use(cors({
  allowedHeaders:['Content-Type','Authentication'],
  exposedHeaders:['Content-Range','Content-Type'],
  credentials:true,
  origin:process.env.CORS_ORIGIN
}))

//Middleware To parse req.body
app.use(express.json());
app.use(cookieParser());
// {TBD Sanitize}


//Router level middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/diaryentry',diaryEntryRouter);
app.use('/api/v1/friends',friendsRouter);
app.use('/api/v1/comment',commentRouter);

//{TBD unhandled Routes}

//Global Error Handler
app.use(globalErrorHandler);
module.exports= app;