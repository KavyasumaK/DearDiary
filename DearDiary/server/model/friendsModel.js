/****************************************
 * Title: friendsModel
 * Intial Date: 09/19/2020
 * Summary: MOngoose Schema for friend requests and notifications.
 * Change 1:
 ***************************************/

const mongoose = require('mongoose');
const validator = require('validator');

//Creating mongoose Schema for the friendList.
const friendsSchema = mongoose.Schema({
  userEmail:{
    type:String,
    required:[true, 'email ID required to send friend requests.'],
    unique: [true, "Mr.Henshaw corresponds only with unique email IDs."],
    lowercase: true,
    validate: [
      validator.isEmail,
      "Mr. Henshaw doesn't recognize this email ID",
    ],
  },
  friendList:{
    type:[]
  },
  sentRequest:{
    type:[]
  },
  receivedRequest:{
    type:[]
  }
});

//To return the latest documents for all the find methods.
friendsSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Friend = mongoose.model("Friend", friendsSchema);

module.exports = Friend;