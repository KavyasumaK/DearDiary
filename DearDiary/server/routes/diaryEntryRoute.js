const router = require('express').Router();

const authController = require('../controller/authController');
const diaryEntryController=require('../controller/diaryEntryController');


//protected routes
router.use(authController.protectPath);
router.post('/makeentry', diaryEntryController.makeAnEntry);
router.get('/getmyentries', diaryEntryController.getMyEntries);
router.post('/getmyentriesondate', diaryEntryController.getMyEntryOnDate);
router.get('/getMyLatestEntry',diaryEntryController.getMyLatestEntry);

module.exports=router;