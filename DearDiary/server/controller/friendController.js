/****************************************
 * Title: friendsController
 * Intial Date: 09/19/2020
 * Summary: Controller for friend requests and notifications.
 * Change 1:
 ***************************************/

const friendModel = require("../model/friendsModel");
const userModel = require("../model/userModel");
const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");

const getFriendDocForMyEmail = async (myEmail) => {
  return await friendModel.findOne({
    userEmail: myEmail,
  });
};
const getUserDetailsFromEmailList = async (emailList) => {
  return await userModel
    .find({ email: { $in: emailList } })
    .select("-__v -passwordChangedAt")
    .sort({ userName: +1 });
};

//get the details of the users of recieved requests coming from getReceivedRequests middleware
exports.getNotifications = catchAsync(async (req, res, next) => {
  let listOfEmails = await getFriendDocForMyEmail(req.user.email);
  let receivedRequests = listOfEmails.receivedRequest;
  let sentRequests = listOfEmails.sentRequest;
  // let listOfEmails = req.receivedRequests[0].receivedRequest;
  let receiveRequestListObj = null;
  let sentRequestListObj = null;
  if (receivedRequests.length > 0)
    receiveRequestListObj = await getUserDetailsFromEmailList(receivedRequests);
  if (sentRequests.length > 0)
    sentRequestListObj = await getUserDetailsFromEmailList(sentRequests);

  res.status(200).json({
    status: "success",
    receivedRequests: receiveRequestListObj,
    sentRequests: sentRequestListObj,
  });
});

exports.getFriends = catchAsync(async (req, res, next) => {
  const friendsList = (await getFriendDocForMyEmail(req.user.email)).friendList;
  let friends = null;
  if (friendsList.length > 0)
    friends = await getUserDetailsFromEmailList(friendsList);
  res.status(201).json({
    status: "Success",
    friends,
  });
});

//middleware to check if the entered friend's email exists.
exports.findFriend = catchAsync(async (req, res, next) => {
  const { friendEmail } = req.body;

  if (!friendEmail)
    return next(
      new AppError(
        "We require your friends email ID to send a friend request",
        401
      )
    );

  if (friendEmail.toLowerCase() === req.user.email.toLowerCase())
    return next(new AppError("Your search email is your email", 401));

  let friendDetails = await userModel
    .findOne({ email: friendEmail.toLowerCase() })
    .select("-_id -__v -passwordChangedAt");

  if (!friendDetails)
    return next(new AppError("Your friend is not a dear diary user", 401));

  req.friendDetails = friendDetails;
  next();
});

//gets the email ID in request body, searches or the email in userSchema, if exists responds with username
exports.searchForFriend = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "Success",
    friendDetails: req.friendDetails,
  });
});

// To send friend request
exports.sendFriendRequest = catchAsync(async (req, res, next) => {
  let friendDetailsEmail = req.friendDetails
    ? req.friendDetails.email.toLowerCase()
    : null;
  let myEmail = req.user.email.toLowerCase();
  let userSendReqs = null;
  let friendsReceiveReqs = null;

  // if (friendDetailsEmail) {
  //check if the user and the friend are in friendlist db
  const usersExist = await friendModel.find({
    userEmail: { $in: [myEmail, friendDetailsEmail] },
  });

  //Add the person (user or friend) who doesn't exist in the friends db.
  if (usersExist.length === 0) {
    await friendModel.insertMany([
      { userEmail: myEmail },
      { userEmail: friendDetailsEmail },
    ]);
    userSendReqs = [];
    friendsReceiveReqs = [];
  } else if (usersExist.length === 1) {
    await friendModel.create({
      userEmail:
        usersExist[0].userEmail === myEmail ? friendDetailsEmail : myEmail,
    });
    if (usersExist[0].userEmail === myEmail) {
      userSendReqs = usersExist[0].sentRequest;
      friendsReceiveReqs = [];
    } else {
      friendsReceiveReqs = usersExist[0].receivedRequest;
      userSendReqs = [];
    }
  }
  //if both are present check if they are already friends
  else if (usersExist.length === 2) {
    if (usersExist[0].friendList.indexOf(usersExist[1].userEmail) < 0) {
      userSendReqs =
        usersExist[0].userEmail === myEmail
          ? usersExist[0].sentRequest
          : usersExist[1].sentRequest;
      friendsReceiveReqs =
        usersExist[0].userEmail === myEmail
          ? usersExist[1].receivedRequest
          : usersExist[0].receivedRequest;
    } else {
      return next(
        new AppError("You are already friends with this person", 400)
      );
    }
  }

  //user gets added the friend email in send request
  // and friend gets user email in received request
  //If freind request was previously sent, does nothing and returns success.
  if (userSendReqs.length >= 0 && friendsReceiveReqs.length >= 0) {
    if (!userSendReqs.includes(friendDetailsEmail)) {
      userSendReqs.push(friendDetailsEmail);
      await friendModel.updateOne(
        { userEmail: myEmail },
        { sentRequest: userSendReqs }
      );
    }
    if (!friendsReceiveReqs.includes(myEmail)) {
      friendsReceiveReqs.push(myEmail);
      await friendModel.updateOne(
        { userEmail: friendDetailsEmail },
        { receivedRequest: friendsReceiveReqs }
      );
    }
  }
  res.status(200).json({
    status: "success",
  });
  // }
});

const getBothUserAndFriend = async (req, res, next) => {
  if (!req.body.email || req.body.email === req.user.email)
    return next(new AppError("Friends email is invalid", 401));
  const requestExist = await friendModel.find({
    userEmail: {
      $in: [req.body.email.toLowerCase(), req.user.email.toLowerCase()],
    },
  });
  //if  error return error
  if (requestExist.length < 2)
    return next(
      new AppError(
        "Seems like you have not received a request from this friend to accept.",
        401
      )
    );
  return requestExist;
};

const updateFriendList = async (
  myEmail,
  myFilter,
  friendEmail,
  friendFilter
) => {
  //update userEmail friend list and received requests
  let newMyFriendList = await friendModel.findOneAndUpdate(
    { userEmail: myEmail },
    myFilter,
    {
      new: true, //to return new doc instead of the old. Defaults to false.
      runValidators: true, //To run validators set in schema.
      useFindAndModify: false,
    }
  );
  
  console.log(newMyFriendList)
  //update friendemails friend list and sentRequest.
  await friendModel.updateOne({ userEmail: friendEmail }, friendFilter);
  return newMyFriendList;
};

//accept friend request
exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
  //get the user email and fried email doc from friends collection.
  const requestExist = await getBothUserAndFriend(req, res, next);
  // const requestExist = await getBothUserAndFriend(myEmail, friendEmail);
  const friendEmail = req.body.email.toLowerCase();
  const myEmail = req.user.email.toLowerCase();

  let myFriendList = null;
  let myReceivedRequest = null;
  let mysentRequest = null;
  let friendsFriendList = null;
  let friendSentRequest = null;
  let friendReceivedRequest = null;

  //Remove the  friend email from recieved reqs
  //remove userEmail from sent requests
  //and update friendlist
  if (requestExist[0].userEmail === myEmail) {
    myFriendList = requestExist[0].friendList;
    myReceivedRequest = requestExist[0].receivedRequest;
    mysentRequest = requestExist[0].sentRequest;
    friendsFriendList = requestExist[1].friendList;
    friendSentRequest = requestExist[1].sentRequest;
    friendReceivedRequest = requestExist[1].receivedRequest;
  } else {
    myFriendList = requestExist[1].friendList;
    myReceivedRequest = requestExist[1].receivedRequest;
    mysentRequest = requestExist[1].sentRequest;
    friendsFriendList = requestExist[0].friendList;
    friendSentRequest = requestExist[0].sentRequest;
    friendReceivedRequest = requestExist[0].receivedRequest;
  }

  if (myFriendList.indexOf(friendEmail) > -1)
    return next(new AppError("You are already friends with this person", 401));
  if (myReceivedRequest.indexOf(friendEmail) < 0)
    return next(
      new AppError("You do not have a friend request from this person", 401)
    );

  myFriendList.push(friendEmail);
  myReceivedRequest = myReceivedRequest.filter((el) => el !== friendEmail);
  mysentRequest = mysentRequest.filter((el) => el !== friendEmail);

  friendsFriendList.push(myEmail);
  friendSentRequest = friendSentRequest.filter((el) => el !== myEmail);
  friendReceivedRequest = friendReceivedRequest.filter((el) => el !== myEmail);

  //update userEmail friend list and received requests
  const myFilter = {
    friendList: myFriendList,
    receivedRequest: myReceivedRequest,
    sentRequest: mysentRequest,
  };
  const friendFilter = {
    friendList: friendsFriendList,
    sentRequest: friendSentRequest,
    receivedRequest: friendReceivedRequest,
  };
  await updateFriendList(myEmail, myFilter, friendEmail, friendFilter);
  this.getNotifications(req,res,next);
});

//Delete Friend request
exports.deleteFriend = catchAsync(async (req, res, next) => {
  //get the user email and fried email doc from friends collection.
  const requestExist = await getBothUserAndFriend(req, res, next);
  let myEmail = req.user.email.toLowerCase();
  let friendEmail = req.body.email.toLowerCase();

  let myFriendList = null;
  let friendsFriendList = null;

  //Remove the  friend email from recieved reqs
  //remove userEmail from sent requests
  //and update friendlist
  if (requestExist[0].userEmail === myEmail) {
    myFriendList = requestExist[0].friendList;
    friendsFriendList = requestExist[1].friendList;
  } else {
    myFriendList = requestExist[1].friendList;
    friendsFriendList = requestExist[0].friendList;
  }
  if (myFriendList.indexOf(friendEmail) < 0)
    return next(new AppError("You are not friend with this person", 401));

  myFriendList = myFriendList.filter((el) => el !== friendEmail);
  friendsFriendList = friendsFriendList.filter((el) => el !== myEmail);

  //update userEmail friend list
  const myFilter = { friendList: myFriendList };
  const friendFilter = { friendList: friendsFriendList };
  await updateFriendList(myEmail, myFilter, friendEmail, friendFilter);
  this.getFriends(req, res, next);
});

exports.rescindRequests = catchAsync(async (req, res, next) => {
  const myEmail = req.user.email;
  const friendEmail = req.body.email;
  const sentOrReceived = req.body.type;
  let receivedList = "";
  let sentList = "";

  let requestExist = await getBothUserAndFriend(req, res, next);

  if (
    (requestExist[0].userEmail === myEmail && sentOrReceived === "sent") ||
    (requestExist[1].userEmail === myEmail && sentOrReceived === "received")
  ) {
    sentList = requestExist[0].sentRequest;
    receivedList = requestExist[1].receivedRequest;
  } else {
    sentList = requestExist[1].sentRequest;
    receivedList = requestExist[0].receivedRequest;
  }

  sentList = sentList.filter((request) => {
    if (request !== myEmail && request !== friendEmail) return request;
  });
  receivedList = receivedList.filter((request) => {
    if (request !== myEmail && request !== friendEmail) return request;
  });

  let myFilter = {sentRequest:sentList}
  let friendFilter = {receivedRequest:receivedList}

  if(sentOrReceived==='received'){
    myFilter = {receivedRequest:receivedList}
    friendFilter= {sentRequest:sentList}
  }

  await updateFriendList(myEmail, myFilter, friendEmail, friendFilter);  
  this.getNotifications(req,res,next)
});
