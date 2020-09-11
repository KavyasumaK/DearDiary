/****************************************
 * Title: userController
 * Intial Date: 09/07/2020
 * Summary: Controller functions for the user.
 * Change 1: 09/08/2020: added protect path and update methods
 ***************************************/
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const multer = require("multer");

const userModel = require("../model/userModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//Creates a signedtoken and sends the response to the client
const createAndSendJWT = (user, statusCode, res) => {
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
    httpOnly: true, //To make sure cookie is not tampered with in the browser
    secure: true,
  };

  // add cookie to response
  res.cookie(process.env.COOKIE_NAME, signedJWT, cookieOptions);
  user.password = undefined;

  //send response
  res.status(statusCode).json({
    status: "Registered",
    token: signedJWT,
    user,
  });
};

//Function for signup/register
exports.Register = catchAsync(async (req, res, next) => {
  const user = await userModel.create(req.body);
  createAndSendJWT(user, 201, res);
});

//Login: compare email and encrypted password
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Email and password required", 400));

  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+password");

  let statusCode;
  if (!user || !(await user.checkPassword(req.body.password, user.password))) {
    return next(new AppError("Email and/or password do not match", 404));
  } else {
    statusCode = 200;
  }
  createAndSendJWT(user, statusCode, res);
});

//logout with a dummy token sent to the browser that expires in 10s
exports.logout = (req, res) => {
  res.cookie(process.env.COOKIE_NAME, "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged Out",
  });
};

//function to check if the token recieved is valid.
exports.protectPath = catchAsync(async (req, res, next) => {
  // get the token from req (browser as well as API testing platforms such as postman).
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.MrHenshawAsDearDiary) {
    token = req.cookies.MrHenshawAsDearDiary;
  }

  //if doesn't exist throw error
  if (!token) {
    return next(
      new AppError("Seems like you have signed out please sign in", 401)
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
      new AppError("Seems like you have signed out please sign in", 401)
    );
  //if old password: verified throw iat of the token
  if (existUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError("Password has been changed! Please log in again.", 401)
    );
  }
  //Grant the user access to paths
  req.user = existUser;
  res.locals.user = existUser;
  next();
});

//get user details
exports.myProfile = (req, res, next) => {
  res.status(201).json({
    user: res.locals.user,
  });
};

//update user email, name (and photo)
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.user);
  // console.log(req.body);
  //if trying to update password throw error
  if (req.body.password)
    return next(
      new AppError(
        "You cannot update password here. Please try through updatepassword",
        401
      )
    );
  //else update email and name only (allowed fields to be updated)
  const filteredObj = {};
  Object.keys(req.body).forEach((el) => {
    if (el === "email" || el === "userName" || el === "aboutMe")
      filteredObj[el] = req.body[el];
  });
  // {TBD: when logic for uploading photo is added.}
  // if (req.file) filteredObj.photo = req.file.filename;
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    filteredObj,
    {
      new: true, //to return updated user and not the prev values
      runValidators: true,
    }
  );
  const modifiedUser = { ...updatedUser._doc, _id: undefined, __v: undefined };

  console.log(modifiedUser);
  res.status(200).json({
    status: "Success.",
    user: modifiedUser,
  });
});

//update user password.
exports.updatePassword = catchAsync(async (req, res, next) => {
  //check if body has both old and new passwords.
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return next(
      new AppError("Need both old password as well as the new password", 401)
    );

  //check if oldpassword matched
  const user = await userModel.findById(req.user._id).select("+password");

  if (!(await user.checkPassword(req.body.oldPassword, user.password))) {
    return next(new AppError("Wrong Password!", 400));
  }

  //findByIDandUpdate doesn't work as intended. JWT sent in this case is not right
  // const newUser = await userModel.findByIdAndUpdate(
  //   req.user._id,
  //   { password: req.body.newPassword },
  //   { new: true, runValidators: true }
  // );

  user.password = req.body.newPassword;
  await user.save();
  createAndSendJWT(user, 200, res);
});
//{TBD upload picture, reset password, emailing ability}
