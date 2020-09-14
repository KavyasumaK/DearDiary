/****************************************
 * Title: userController
 * Intial Date: 09/07/2020
 * Summary: Controller functions for the user.
 * Change 1: 09/08/2020: added protect path and update methods
 ***************************************/

const multer = require("multer");

const userModel = require("../model/userModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


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
      useFindAndModify:false
    }
  );
  const modifiedUser = { ...updatedUser._doc, _id: undefined, __v: undefined };

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
