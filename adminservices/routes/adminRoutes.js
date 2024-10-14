// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /admin/api/v1/login:
 *   post:
 *     summary: Login to admin portal
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/api/v1/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await adminService.login(email, password);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/otpverify:
 *   post:
 *     summary: Verify OTP for login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin_id:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */
router.post('/api/v1/otpverify', async (req, res) => {
  const { admin_id, otp } = req.body;
  const result = await adminService.verifyOtp(admin_id, otp);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/resendotp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               admin_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Error resending OTP
 */
router.post('/api/v1/resendotp', async (req, res) => {
  const { admin_id } = req.body;
  const result = await adminService.resendOtp(admin_id);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/logout:
 *   get:
 *     summary: Logout user/admin from portal
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.get('/api/v1/logout', authMiddleware, async (req, res) => {
  const result = await adminService.logout(req.user.id);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/addfaq:
 *   post:
 *     summary: Add new FAQ
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               ans:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: FAQ added successfully
 *       400:
 *         description: Error adding FAQ
 */
router.post('/api/v1/addfaq', authMiddleware, async (req, res) => {
  const { question, ans, order } = req.body;
  const result = await adminService.addFaq(question, ans, order);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/faqlist:
 *   get:
 *     summary: Get FAQ list
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: FAQ list retrieved successfully
 *       400:
 *         description: Error retrieving FAQ list
 */
router.get('/api/v1/faqlist', authMiddleware, async (req, res) => {
  const result = await adminService.getFaqList();
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/editfaq:
 *   post:
 *     summary: Edit FAQ details
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *               question:
 *                 type: string
 *               ans:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       400:
 *         description: Error updating FAQ
 */
router.post('/api/v1/editfaq', authMiddleware, async (req, res) => {
  const { record_id, question, ans, order } = req.body;
  const result = await adminService.editFaq(record_id, question, ans, order);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/deletefaq:
 *   post:
 *     summary: Delete FAQ record
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
 *       400:
 *         description: Error deleting FAQ
 */
router.post('/api/v1/deletefaq', authMiddleware, async (req, res) => {
  const { record_id } = req.body;
  const result = await adminService.deleteFaq(record_id);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/emailloglist:
 *   get:
 *     summary: Get email log list
 *     tags: [Email Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email log list retrieved successfully
 *       400:
 *         description: Error retrieving email log list
 */
router.get('/api/v1/emailloglist', authMiddleware, async (req, res) => {
  const result = await adminService.getEmailLogList();
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/emaillogdetails:
 *   post:
 *     summary: Get email log details
 *     tags: [Email Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email log details retrieved successfully
 *       400:
 *         description: Error retrieving email log details
 */
router.post('/api/v1/emaillogdetails', authMiddleware, async (req, res) => {
  const { record_id } = req.body;
  const result = await adminService.getEmailLogDetails(record_id);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/updateterms:
 *   post:
 *     summary: Update terms & conditions
 *     tags: [CMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Terms & conditions updated successfully
 *       400:
 *         description: Error updating terms & conditions
 */
router.post('/api/v1/updateterms', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const result = await adminService.updateTerms(content);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/updatepolicy:
 *   post:
 *     summary: Update privacy policy
 *     tags: [CMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Privacy policy updated successfully
 *       400:
 *         description: Error updating privacy policy
 */
router.post('/api/v1/updatepolicy', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const result = await adminService.updatePolicy(content);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/updateagreement:
 *   post:
 *     summary: Update customer agreement
 *     tags: [CMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer agreement updated successfully
 *       400:
 *         description: Error updating customer agreement
 */
router.post('/api/v1/updateagreement', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const result = await adminService.updateAgreement(content);
  res.status(result.status).json(result);
});

/**
 * @swagger
 * /admin/api/v1/updateheader:
 *   post:
 *     summary: Update CMS Header Section
 *     tags: [CMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               menu1:
 *                 type: string
 *               menu2:
 *                 type: string
 *               menu3:
 *                 type: string
 *               menu4:
 *                 type: string
 *               menu5:
 *                 type: string
 *               menu6:
 *                 type: string
 *     responses:
 *       200:
 *         description: Header updated successfully
 *       400:
 *         description: Error updating header
 */
router.post('/api/v1/updateheader', authMiddleware, async (req, res) => {
  const { menu1, menu2, menu3, menu4, menu5, menu6 } = req.body;
  const result = await adminService.updateHeader(menu1, menu2, menu3, menu4, menu5, menu6);
  res.status(result.status).json(result);
});

module.exports = router;