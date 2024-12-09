 const express = require('express');
 const router = express.Router();
const authmiddleware = require('../middleware/auth');
const rolecontroller = require('../controllers/role_controller');

router.post('/addrole',authmiddleware, rolecontroller.addrole);
router.post('/editrole', authmiddleware,rolecontroller.editrole);
router.post('/deleterole',authmiddleware, rolecontroller.deleterole);
router.get('/listrole',authmiddleware, rolecontroller.listroles);

 module.exports = router;