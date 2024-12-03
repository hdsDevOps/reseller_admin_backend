const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const SubscriptionController = require('../controllers/subscription_controller');

/**
 * @swagger
 * /subscription/api/v1/getpaymentmethods:
 *   get:
 *     summary: Get payment method list
 *     tags: [Payment Methods]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   status:
 *                     type: boolean
 */
router.get(
  "/getpaymentmethods",
  authMiddleware,
  SubscriptionController.getPaymentMethods
);

/**
 * @swagger
 * /subscription/api/v1/getpaymentmethods:
 *   post:
 *     summary: Update payment method status
 *     tags: [Payment Methods]
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
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Payment method status updated successfully
 */
router.post(
  "/updatepaymentmethodstatus",
  authMiddleware,
  SubscriptionController.updatePaymentMethodStatus
);

/**
 * @swagger
 * /subscription/api/v1/getplansdetailslist:
 *   get:
 *     summary: Get plans and prices details list
 *     tags: [Plans]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of plans and prices
 */
router.get(
  "/getplansdetailslist",
  authMiddleware,
  SubscriptionController.getPlansList
);

/**
 * @swagger
 * /subscription/api/v1/addnewplandetails:
 *   post:
 *     summary: Add new plan details
 *     tags: [Plans]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan_name:
 *                 type: string
 *               icon_image:
 *                 type: string
 *               amount_details:
 *                 type: object
 *               trial_period:
 *                 type: number
 *               sticker_text:
 *                 type: string
 *               top_features:
 *                 type: array
 *                 items:
 *                   type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Plan added successfully
 */
router.post(
  "/addnewplandetails",
  authMiddleware,
  SubscriptionController.addNewPlan
);

/**
 * @swagger
 * /subscription/api/v1/deleteplandetails:
 *   post:
 *     summary: Delete plan details
 *     tags: [Plans]
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
 *         description: Plan deleted successfully
 */
router.post(
  "/deleteplandetails",
  authMiddleware,
  SubscriptionController.deletePlan
);

/**
 * @swagger
 * /subscription/api/v1/editnewplandetails:
 *   post:
 *     summary: Edit plan details
 *     tags: [Plans]
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
 *               plan_name:
 *                 type: string
 *               icon_image:
 *                 type: string
 *               amount_details:
 *                 type: object
 *               trial_period:
 *                 type: number
 *               sticker_text:
 *                 type: string
 *               top_features:
 *                 type: array
 *                 items:
 *                   type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Plan updated successfully
 */
router.post(
  "/editnewplandetails",
  authMiddleware,
  SubscriptionController.editPlan
);

module.exports = router;
