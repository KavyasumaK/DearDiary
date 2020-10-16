/****************************************
 * Title: CommentsRouter
 * Intial Date: 10/2020
 * Summary: Routing to comments by users.
 * Change 1:
 * **************************************/

const router = require('express').Router();

const authController=require('../controller/authController');
const commentController = require('../controller/commentController');

//middleware to make sure all the rest of the paths are protected.
router.use(authController.protectPath);
//protected paths
router.post('/insertcomment', commentController.insertComment);
router.post('/getcomments',commentController.getComments);
router.patch('/updatecomment',commentController.updateComment);
router.delete('/deletecomment',commentController.deleteComment);

module.exports=router;