const router = require('express').Router();

const authController=require('../controller/authController');
const commentController = require('../controller/commentController');

//protected paths
router.use(authController.protectPath);
router.post('/insertcomment', commentController.insertComment);
router.post('/getcomments',commentController.getComments);
router.patch('/updatecomment',commentController.updateComment);
router.delete('/deletecomment',commentController.deleteComment);

module.exports=router;