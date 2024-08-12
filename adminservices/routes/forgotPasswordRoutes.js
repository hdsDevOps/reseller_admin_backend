const express = require("express");
const router = express.Router();
const forgotPasswordService = require('../services/forgotPasswordService.js');

/**
 * @swagger
 * /adminservices/forgot-password/generate-otp:
 *   post:
 *     summary: Generate OTP for password reset
 *     tags: [Forgot Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *       400:
 *         description: Error generating OTP
 */
router.post('/generate-otp', async (req, res) => {
    const { email } = req.body;
    res.status(200).send(await forgotPasswordService.generateOTP({ email }));
});

/**
 * @swagger
 * /adminservices/forgot-password/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Forgot Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Error verifying OTP
 */
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    res.status(200).send(await forgotPasswordService.verifyOTP({ email, otp }));
});

/**
 * @swagger
 * /adminservices/forgot-password/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Forgot Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Error resetting password
 */
router.post('/reset-password', async (req, res) => {
    const { email, newPassword, otp } = req.body;
    res.status(200).send(await forgotPasswordService.resetPassword({ email, newPassword, otp }));
});

module.exports = router;