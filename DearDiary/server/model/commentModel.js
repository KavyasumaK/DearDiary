/****************************************
 * Title: commentsModel
 * Intial Date: 10/09/2020
 * Summary: MOngoose Schema for comments.
 * Change 1:
 ***************************************/
const mongoose = require("mongoose");

//Creating mongoose Schema for the comments by users.
const commentSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "To post a comment is required"],
    },
    userID: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    entryID: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "DiaryEntry",
      },
    ],
  },
  { timestamps: { createdAt: "createdAt" } }
);

//To return the latest documents for all the find methods.
commentSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
