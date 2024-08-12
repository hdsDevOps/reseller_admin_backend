// Import the express router
const express = require('express');
const router = express.Router();
const logindetails = require('../services/loginservice.js');

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    res.status(201).send(await logindetails.register_new_admin({ email, password }));
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    res.status(200).send(await logindetails.login_admin({ email, password }));
});

router.post('/forgetpassword', async (req, res) => {
    const { email } = req.body;
    res.status(200).send(await logindetails.generate_forget_password_link({ email }));
});

module.exports = router;
