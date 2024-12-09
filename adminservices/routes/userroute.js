 const express = require('express');
 const router = express.Router();
const authmiddleware = require('../middleware/auth');
const usercontroller = require('../controllers/user_controller');

router.post('/addusers',authmiddleware, usercontroller.adduser);

router.post('/editusers', authmiddleware,usercontroller.edituser);
router.post('/deleteusers',authmiddleware, usercontroller.deleteuser);
router.post('/listusers',authmiddleware, usercontroller.listusers);

 module.exports = router;