/****************************************
 * Title: userRouter
 * Intial Date: 09/07/2020
 * Summary: Routing to specific functions for user
 * Change 1: 09/08/2020: middleware to protect protected paths
 * **************************************/

const router = require('express').Router(); 

const userController = require('../controller/userController');

router.post('/register', userController.Register);
router.get('/login', userController.login);  
router.get('/logout', userController.logout);
// {TBD: forgot password}     

//middleware to make sure all the rest of the paths are protected.
router.use(userController.protectPath);

router.patch("/updateme", userController.updateMe);
router.patch('/updatepassword', userController.updatePassword);
module.exports = router;