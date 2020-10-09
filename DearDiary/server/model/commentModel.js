/****************************************
 * Title: commentsModel
 * Intial Date: 10/09/2020
 * Summary: MOngoose Schema for comments.
 * Change 1:
 ***************************************/
const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
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
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
