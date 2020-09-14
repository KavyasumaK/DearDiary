const diaryEntryModel = require("../model/diaryEntryModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { findOne } = require("../model/diaryEntryModel");

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

exports.getMyEntries = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const myEntries = await diaryEntryModel
    .find({ userID: userID })
    .sort("-created_at");
  res.status(201).json({
    Status: "Success",
    myEntries,
  });
});

exports.getMyEntryOnDate = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const date = new Date(req.body.date);
  const endOfDay = new Date(new Date(date).setHours(23, 59, 59));
  const myEntryOnDate = await diaryEntryModel.find({ userID: userID }).find({
    created_at: {
      $gte: date,
      $lte: endOfDay,
    },
  });
  res.status(201).json({
    Status: "Success",
    myEntryOnDate,
  });
});

exports.getMyLatestEntry = catchAsync(async (req, res, next) => {
  const userID = req.user._id;
  const latestEntry = await diaryEntryModel
    .findOne({ userID: userID })
    .sort("-created_at");
    res.status(201).json({
      Status:"Success",
      latestEntry
    })
});

// {TBD: To add photo of the day along with entry.}
