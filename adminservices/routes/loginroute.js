// Import the express router
const express = require('express');
const router = express.Router();
const logindetails = require('../services/loginservice.js');

// Create new Admin credentials for login
/**
 * @swagger
 * /adminservices/register:
 *   post:
 *     summary: Register a new admin
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin's email address
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: Admin's password
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Admin registered successfully
 */
router.post('/register', async (req, res) =>{
    const { email, password } = req.body;
    res.status(200).send(await logindetails.register_new_admin({ email, password }));
});

// Admin login route
/**
 * @swagger
 * /adminservices/login:
 *   post:
 *     summary: Admin login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin's email address
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: Admin's password
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    res.status(200).send(await logindetails.login_admin({ email, password }));
});

// Forget Password Link generation
/**
 * @swagger
 * /adminservices/forgetpassword:
 *   post:
 *     summary: Generate forget password link
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin's email address
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Forget password link generated successfully
 */
router.post('/forgetpassword', async (req, res) => {
    const { email } = req.body;
    res.status(200).send(await logindetails.generate_forget_password_link({ email }));
});

module.exports = router;
