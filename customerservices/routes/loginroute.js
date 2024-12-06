const express = require('express');
const router = express.Router();
const logindetails = require('../services/loginservice.js');
//const userdetails = require('../services/userservice.js');
// Create new Admin credentials for login
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    res.status(200).send(await logindetails.register_new_admin({ email, password }));
})
// Admin login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    res.status(200).send(await logindetails.login_admin({ email, password }));
});

router.post('/add_user', async (req, res) => {
    //const result = await userdetails.addnew_user(req.body);
    //res.status(result.status).json({status: result.status, message: result.message, customer_id: result.userId });
  });
module.exports = router;