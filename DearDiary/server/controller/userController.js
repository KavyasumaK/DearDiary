/****************************************
 * Title: userController
 * Intial Date: 09/07/2020
 * Summary: Controller functions for the user.
 * Change 1: 09/08/2020: added protect path and update methods
 ***************************************/

const multer = require("multer");
const sharp = require('sharp');

const userModel = require("../model/userModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


//get user details
exports.myProfile = (req, res, next) => {
  res.status(201).json({
    user: res.locals.user,
  });
};

//saving the uploaded file in buffer before processing
const multerStorage=multer.memoryStorage();

//function to filter file type to images on server side.
//cd here is a callback funtion. "file" contains properties of the uploaded file
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    //if file type is image return true else return false
    cb(null, true);
  } else {
    cb(new AppError('Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('picture');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  //making the filename as unique as possible
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; 

  await sharp(req.file.buffer)
    .resize(200, 200) //resizing images to be small
    .toFormat('jpeg') //converting the format to jpeg
    .jpeg({ quality: 90 }) //compressing the quality
    .toFile(`public/users/${req.file.filename}`);
  next();
});

//update user email, name (and photo)
exports.updateMe = catchAsync(async (req, res, next) => {
  //if trying to update password throw error
  if (req.body.password)
    return next(
      new AppError(
        "You cannot update password here. Please try through updatepassword.",
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
  if (req.file) filteredObj.profilePicture = req.file.filename;
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


//{TBD upload picture, reset password, emailing ability}
