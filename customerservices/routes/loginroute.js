const express = require('express');
const router = express.Router();
const logindetails = require('../services/loginservice.js');
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
// Get all registered customer
router.get('/customers', async (req, res) => {
    res.status(200).send(await logindetails.get_all_customers());
});

module.exports = router;