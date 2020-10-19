/****************************************
 * Title: userRouter
 * Intial Date: 09/07/2020
 * Summary: Routing to specific functions for user
 * Change 1: 09/08/2020: middleware to protect protected paths
 * **************************************/

const router = require('express').Router(); 
const cors = require('cors');

const authController = require('../controller/authController');
const userController = require('../controller/userController');

router.post('/signup',cors(), authController.Register);
router.post('/login',cors(), authController.login);  
router.get('/logout',cors(), authController.logout);
// {TBD: forgot password}     

//middleware to make sure all the rest of the paths are protected.
router.use(authController.protectPath);
router.get('/getme',cors(), userController.myProfile);
router.patch("/updateme",cors(), userController.uploadUserPhoto, userController.resizeUserPhoto ,userController.updateMe);
router.patch('/updatepassword',cors(), authController.updatePassword);
module.exports = router;