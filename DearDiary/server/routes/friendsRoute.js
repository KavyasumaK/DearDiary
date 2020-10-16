/****************************************
 * Title: FriendsRouter
 * Intial Date: 09/19/2020
 * Summary: Routing to specific functions for friends
 * Change 1: 
 * **************************************/

const router = require('express').Router(); 

const friendController = require('../controller/friendController');
const authController=require('../controller/authController');

//middleware to make sure all the rest of the paths are protected.
router.use(authController.protectPath);
//Protected paths
router.get('/getmyfriends', friendController.getFriends);
router.post('/searchforafriend', friendController.findFriend,friendController.searchForFriend);
router.post('/sendfriendrequest',friendController.findFriend,friendController.sendFriendRequest);
router.get('/getnotifications', friendController.getNotifications);
router.post('/acceptfriendrequest',friendController.acceptFriendRequest);
router.delete('/deletefriend',friendController.deleteFriend);
router.post('/rescindrequest',friendController.rescindRequests);

module.exports = router;