const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const NotificationController = require('../controllers/notification_controller');


router.post("/addnotificationtemplatedetails",authMiddleware,NotificationController.addnotificationrecord);

/**
 * @swagger
 * /notification/api/v1/getnotificationlist:
 *   get:
 *     summary: Get notification templates list
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of notification templates
 */
router.get(
  "/getnotificationlist",
  authMiddleware,
  NotificationController.getNotificationList
);

/**
 * @swagger
 * /notification/api/v1/getnotificationtemplatedetails:
 *   post:
 *     summary: Get notification template details
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
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
 *         description: Template details retrieved successfully
 */
router.post(
  "/getnotificationtemplatedetails",
  authMiddleware,
  NotificationController.getTemplateDetails
);

/**
 * @swagger
 * /notification/api/v1/updatenotificationtemplate:
 *   post:
 *     summary: Update notification template
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               record_id:
 *                 type: string
 *               template_content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Template updated successfully
 */
router.post(
  "/updatenotificationtemplate",
  authMiddleware,
  NotificationController.updateTemplate
);

/**
 * @swagger
 * /notification/api/v1/sendtestemailnotification:
 *   post:
 *     summary: Send test email notification
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test email sent successfully
 */
router.post(
  "/sendtestemailnotification",
  authMiddleware,
  NotificationController.sendTestEmail
);

router.post(
  "/sendmailtocustomer",
  authMiddleware,
  NotificationController.sendmailtocustomer
);

router.get(
  "/emaillog",

  NotificationController.emaillogdetails
);

module.exports = router;
