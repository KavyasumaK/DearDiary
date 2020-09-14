/****************************************
 * Title: userRouter
 * Intial Date: 09/07/2020
 * Summary: Routing to specific functions for user
 * Change 1: 09/08/2020: middleware to protect protected paths
 * **************************************/

const router = require('express').Router(); 

const authController = require('../controller/authController');
const userController = require('../controller/userController');

router.post('/signup', authController.Register);
router.post('/login', authController.login);  
router.get('/logout', authController.logout);
// {TBD: forgot password}     

//middleware to make sure all the rest of the paths are protected.
router.use(authController.protectPath);
router.get('/getme', userController.myProfile);
router.patch("/updateme", userController.updateMe);
router.patch('/updatepassword', userController.updatePassword);
module.exports = router;