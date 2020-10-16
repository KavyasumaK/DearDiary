      
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const validator = require("validator");

//Creating mongoose Schema for the user.
const userSchema = mongoose.Schema({
  userName: {
    required: [true, "Mr.Henshaw wants to know your name."],
    type: String,
  },
  email: {
    type: String,
    required: [
      true,
      "Mr. Henshaw cannot correspond without your email address",
    ],
    unique: [true, "Mr.Henshaw corresponds only with unique email IDs."],
    lowercase: true,
    validate: [
      validator.isEmail,
      "Mr. Henshaw doesn't recognize this email ID",
    ],
  },
  profilePicture: {
    type: String,
    default: 'DefaultUser.jpg'
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false, //To stop showing up in the user queries.
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  aboutMe:String,
});

//encrypt password
userSchema.pre("save", async function (next) {
  //only run if the password was modified
  if (!this.isModified("password")) return next();
  //has password with cost 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//if password is updated/reset add passwordChangedAt
userSchema.pre("save", function (next) {
  //do not populate passwordChangedAt when password is not modified or the document is new
  if (!this.isModified("password") || this.isNew) return next();
  //pre dating so as not to compromise the reason for changing password.
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//To return the latest documents for all the find methods.
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//to compare the hashed passwords when user logs in.
userSchema.methods.checkPassword = async function (
  userSentPassword,
  passswordInRecords
) {
  return await bcrypt.compare(userSentPassword, passswordInRecords);
};

//static method to make sure the token received in request is not the one that was generated before the password was reset/updated.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};
//Creating the mongoose Model for mongoDB
const User = mongoose.model("User", userSchema);

module.exports = User;
