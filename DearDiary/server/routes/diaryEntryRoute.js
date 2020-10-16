/****************************************
 * Title: diaryEntryRouter
 * Intial Date: 09/2020
 * Summary: Routing to specific diary entries
 * Change 1:
 * **************************************/
const router = require('express').Router();

const authController = require('../controller/authController');
const diaryEntryController=require('../controller/diaryEntryController');

//middleware to make sure all the rest of the paths are protected.
router.use(authController.protectPath);
//protected routes
router.post('/makeentry', diaryEntryController.makeAnEntry);
router.get('/getmyentries', diaryEntryController.getMyEntries);
router.post('/getmyentriesondate', diaryEntryController.getMyEntryOnDate);
router.get('/getMyLatestEntry',diaryEntryController.getMyLatestEntry);
router.patch('/updatemyentry', diaryEntryController.updateMyEntry);
router.delete('/deleteMyEntry', diaryEntryController.deleteMyEntry);
router.get('/getfriendsdiaryentry', diaryEntryController.getFriendsEntries);

module.exports=router;