/****************************************
 * Title: authController
 * Intial Date: 09/2020
 * Summary: CRUD operations on authenticating users
 * Change 1:
 ***************************************/
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const userModel = require("../model/userModel");
const friendsModel = require("../model/friendsModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


//Creates a signedtoken and sends the response to the client
const createAndSendJWT = (user, statusCode, req, res) => {
  //sign JWT
  const signedJWT = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  //set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 1000 * 24 * 60 * 60
    ),
    //To make sure cookie is not tampered with in the browser
    httpOnly: true, 
    secure: req.secure||req.headers['x-forward-proto']==='https',
    // secure=req.secure
    sameSite:'none',
  };

  // add cookie to response
  res.cookie(process.env.COOKIE_NAME, signedJWT, cookieOptions);
  user.password = undefined;

  //send response
  res.status(statusCode).json({
    status: "Registered",
    //To set the variable in postman.
    token: signedJWT,
    user,
  });
};

//Function for signup/register
exports.Register = catchAsync(async (req, res, next) => {
  const user = await userModel.create(req.body);
  await friendsModel.create({userEmail:user.email});
  createAndSendJWT(user, 201, req, res);
});

//Login: compare email and encrypted password
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  let statusCode;
  //Check the body has email and password
  if (!email || !password)
    return next(new AppError("Email and password required.", 400));
  //Get the user from DB
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+password");
  
  //if user doesn't exist or password doesn't match after unhashing the password return with error
  if (!user || !(await user.checkPassword(req.body.password, user.password))) {
    return next(new AppError("Email and/or password do not match.", 404));
  } else {
    statusCode = 200;
  }
  //if aauthentication is correct create and send jwt token
  createAndSendJWT(user, statusCode, req, res);
});

//logout with a dummy token sent to the browser that expires in 10s
exports.logout = (req, res) => {
  res.cookie(process.env.COOKIE_NAME, "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged Out",
  });
};

//function to check if the token received is valid.
exports.protectPath = catchAsync(async (req, res, next) => {
  // get the token from req (browser as well as API testing platforms such as postman).
  let token;
  //for postman token sent as in authorization Type bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.MrHenshawAsDearDiary) {
    token = req.cookies.MrHenshawAsDearDiary;
  }

  //if token doesn't exist throw error
  if (!token) {
    return next(
      new AppError("You may not have permissions to access this path. Are you logged in?", 401)
    );
  }

  //if exists verify the token:
  //wrapping the jwt.verify function in promisify
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const existUser = await userModel.findById({ _id: decodedToken.id });
  //if verification fails throw error
  if (!existUser)
    return next(
      new AppError("You may not have permissions to access this path. Are you logged in?", 401)
    );
  //if old password: verified throw iat of the token
  if (existUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError("Password has been changed! Please log in again.", 401)
    );
  }
  //Grant the user access to paths
  req.user = existUser;
  //made use of in userController.getMe
  res.locals.user = existUser;
  next();
});

//update user password.
exports.updatePassword = catchAsync(async (req, res, next) => {
  //check if body has both old and new passwords.
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return next(
      new AppError("Need both old password as well as the new password.", 401)
    );

    if (oldPassword === newPassword)
    return next(
      new AppError("New Password is same as the old password.", 401)
    );

  //check if oldpassword matched
  const user = await userModel.findById(req.user._id).select("+password");

  if (!(await user.checkPassword(req.body.oldPassword, user.password))) {
    return next(new AppError("Wrong Password!", 400));
  }

  //findByIDandUpdate doesn't work as intended. JWT sent in this case is not right
  // const newUser = await userModel.findByIdAndUpdate(req.user._id, { password: req.body.newPassword },{ new: true, runValidators: true });

  user.password = req.body.newPassword;
  await user.save();
  createAndSendJWT(user, 200, req, res);
});