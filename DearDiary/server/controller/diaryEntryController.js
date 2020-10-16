/****************************************
 * Title: diaryEntryController
 * Intial Date: 09/13/2020
 * Summary: CRUD operations on diary entries for logged in users
 * Change 1: 09/16/2020: Added the update and delete logic.
 * Change 2: 10/8/2020: Get friends entries.
 ***************************************/
const diaryEntryModel = require("../model/diaryEntryModel");
const friendsModel = require("../model/friendsModel");
const userModel = require("../model/userModel");

const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/appError");

//Create an entry for a logged in user
exports.makeAnEntry = catchAsync(async (req, res, next) => {
  const { dear, entry, privacy } = req.body;
  const userID = req.user._id;
  const makeEntry = await diaryEntryModel.create({
    dear,
    entry,
    privacy,
    userID,
  });
  res.status(201).json({
    Status: "Success",
    Entry: makeEntry,
  });
});

//Read Entries of a logged in user
exports.getMyEntries = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const myEntries = await diaryEntryModel
    .find({ userID: userID })
    .sort("-createdAt");
  res.status(201).json({
    Status: "Success",
    myEntries,
  });
});

//Read Entries of a logged in user by a specific date
exports.getMyEntryOnDate = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  // if(!req.body||!req.body.date) return this.getMyEntries(req,res,next);
  let date = new Date(req.body.date).setHours(24, 59, 59);
  let endOfDay = new Date(new Date(date).setHours(24, 59, 59));

  const myEntries = await diaryEntryModel.find({ userID: userID }).find({
    createdAt: {
      $gte: date,
      $lte: endOfDay,
    },
  });
  res.status(201).json({
    Status: "Success",
    myEntries,
  });
});

//Read latest entry of a logged in user.
exports.getMyLatestEntry = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const latestEntry = await diaryEntryModel
    .findOne({ userID: userID })
    .sort("-createdAt");
  res.status(201).json({
    Status: "Success",
    latestEntry,
  });
});

//Update Entries if entry and user are valid.
exports.updateMyEntry = catchAsync(async (req, res, next) => {
  let updateEntry = req.body;

  const filter = { _id: req.query.id, userID: req.user._id };

  await diaryEntryModel.findOneAndUpdate(filter, updateEntry, {
    new: true, //to return new doc instead of the old. Defaults to false.
    runValidators: true, //To run validators set in schema.
    useFindAndModify: false,
  });
  //Once updated send all the entries of the user so that the client can be redirected appropriately.
  return this.getMyEntries(req, res, next);
});

//delete an entry of a logged in user
exports.deleteMyEntry = catchAsync(async (req, res, next) => {
  const filter = { _id: req.query.id, userID: req.user._id };
  await diaryEntryModel.findOneAndDelete(filter);
  //Once deleted send all the entries of the user so that the client can be redirected appropriately.
  return this.getMyEntries(req, res, next);
});

//Get all the froends' shared diary entries of a logged in user
exports.getFriendsEntries = catchAsync(async (req, res, next) => {
  //get the user
  const myEmail = req.user.email;
  let friendsEntries = [];
  //get friendlist of the user
  const friendEmailList = (
    await friendsModel
      .find({ userEmail: myEmail })
      .select("-_id -__v -sentRequest -receivedRequest -userEmail")
  )[0].friendList;

  if (friendEmailList.length > 0) {
    //map the IDs to emails
    let friendsIDs = (
      await userModel
        .find({ email: { $in: friendEmailList } })
        .select("-password -aboutMe -passwordChangedAt -__v -userName -email")
    ).map((obj) => obj._id);

    if (friendsIDs.length > 0) {
      //for each one in friendsIDs get dairy entry where entry is public
      friendsEntries = await diaryEntryModel
        .find({ userID: { $in: friendsIDs }, privacy: "share" })
        .populate("userID", "userName email profilePicture")
        .sort("-createdAt")
        .select("-__v");
    }
  }
  
  //Will sent empty friendsEntries Array if logged in user doesn't have any friends.
  res.status(200).json({
    status: "Success",
    friendsEntries,
  });
});
