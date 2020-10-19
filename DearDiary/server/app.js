/****************************************
 * Title: App.js
 * Intial Date: 09/06/2020
 * Summary: Server and req sanitization.
 * Change 1: Added Global Error Handler
 * change2: 09/10/2020 added general cors implementation and cookie parser
 * change3: 09/19/2020 added friends router
 * change4: 10/09/2020 added the sanitization checks, security checks, XSS checks etc and unhandled routes.
 ***************************************/
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require('compression');

const userRouter = require("./routes/userRoute");
const diaryEntryRouter = require("./routes/diaryEntryRoute");
const friendsRouter = require("./routes/friendsRoute");
const commentRouter = require("./routes/commentRoute");
const globalErrorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");

const app = express();
//Middleware to serve Static files
app.use(express.static(path.join(__dirname, "public")));

//http servers security
app.use(helmet());


//{TBD change cors to include deployment origin of front end}
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authentication"],
    exposedHeaders: ["Content-Range", "Content-Type"],
    credentials: true,
    origin: [process.env.CORS_ORIGIN, 'https://polar-sands-07787.herokuapp.com/api/v1/users/getme'],
  })
);

app.use(cors(corsOptions))

// enable pre-flight request
// app.options(
//   "*",
//   cors(corsOptions)
// );

//Middleware To parse req.body
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// {Sanitize}
app.use(mongoSanitize());
//cross site scripting security
app.use(xss());
//avoid parameter pollution//can whitelist if there are any parameters that are required in the application.
app.use(hpp());

//TO compress response
app.use(compression());

//Router level middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/diaryentry", diaryEntryRouter);
app.use("/api/v1/friends", friendsRouter);
app.use("/api/v1/comment", commentRouter);

//unhandled Routes
app.all("*", (req, res, next) =>
  next(new AppError("The path you are looking for does not exist", 401))
);
//Global Error Handler
app.use(globalErrorHandler);
module.exports = app;
