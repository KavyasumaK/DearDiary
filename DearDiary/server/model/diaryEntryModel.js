/****************************************
 * Title: diaryEntryModel
 * Intial Date: 09/13/2020
 * Summary: MOngoose Schema for diaryEntry.
 * Change 1:
 ***************************************/

const mongoose = require("mongoose");

const diaryEntrySchema = mongoose.Schema(
  {
    dear: {
      type: String,
      default: "Diary",
    },
    entry: {
      type: String,
      required: [true, "An entry is required to write the diary"],
    },
    privacy: {
      type: String,
      required: [
        true,
        "Please tell us whether you want the entry to be public or private.",
      ],
      enum: ["private", "share"],
    },
    //referencing user's _id form User.
    userID: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: { createdAt: "createdAt", updateAt: "updatedAt" } }
);

const DiaryEntry = mongoose.model("DiaryEntry", diaryEntrySchema);

module.exports = DiaryEntry;
