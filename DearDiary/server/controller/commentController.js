const mongoose = require("mongoose");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const userModel = require("../model/userModel");
const diaryEntryModel = require("../model/diaryEntryModel");
const commentModel = require("../model/commentModel");

exports.insertComment = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const { entryID, comment } = req.body;

  if (!userID || !entryID)
    return next(new AppError("userID and entryID are required", 401));
  if (!comment || !comment.trim())
    return next(new AppError("Comment is required.", 401));
  const userExist = await userModel.findById(userID);
  const entryExist = await diaryEntryModel.findById(
    mongoose.Types.ObjectId(entryID)
  );
  if (!userExist || !entryExist)
    return next(new AppError("User or entry not found.", 401));
    // {TBD make sure the person commenting on the doc is a friend to whom entry belongs to}
  const newComment = await (await commentModel.create({ userID, entryID, comment }));

  res.status(200).json({
    status: "Success",
    newComment,
  });
});

exports.getComments = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.body && req.body.entryID) filter = { entryID: req.body.entryID };
  const allComments = await commentModel.find(filter).populate("userID", "userName _id").sort("-createdAt");
  res.status(200).json({
    status: "Success",
    allComments,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  let commentID = req.body.commentID;
  let userID = req.user._id;
  let comment = req.body.comment;
  if (!commentID || !comment)
    return next(
      new AppError("Comment ID and entry are required to update comment.", 401)
    );
  const updatedComment = await commentModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(commentID), userID: userID },
    { comment: comment },
    {
      new: true, //to return updated user and not the prev values
      runValidators: true,
      useFindAndModify: false,
    }
  );
  if (!updatedComment)
    return next(new AppError(`Could not update comment.`, 401));
 else this.getComments(req,res,next);
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  let commentID = req.body.commentID;
  let userID = req.user._id;
  if (!commentID)
    return next(new AppError("Comment ID required to delete comment.", 401));
  const deletedComment = await commentModel.findOneAndDelete({
    _id: mongoose.Types.ObjectId(commentID),
    userID: userID,
  });
  if(!deletedComment)  return next(new AppError("Comment could not be deleted.", 401));
  else{
    this.getComments(req,res,next);
  }
});
