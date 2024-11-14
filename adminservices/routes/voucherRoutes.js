const express = require("express");
const router = express.Router();
const vouchercontroller = require("../controllers/voucher_controller");
const authmiddleware = require("../middleware/auth");


/**
 * @swagger
 * /voucher/api/v1/addcustomergroup:
 *   post:
 *     summary: Create new customer group
 *     tags: [Customer Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group_name
 *               - country
 *               - region
 *               - plan
 *               - start_date
 *               - end_date
 *               - license_usage
 *               - no_customer
 *             properties:
 *               group_name:
 *                 type: string
 *               country:
 *                 type: string
 *               region:
 *                 type: string
 *               plan:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               license_usage:
 *                 type: integer
 *               no_customer:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Customer group created successfully
 *       400:
 *         description: Error creating customer group
 */
router.post("/addcustomergroup", authmiddleware,  vouchercontroller.createCustomerGroup);

/**
 * @swagger
 * /voucher/api/v1/editcustomergroup:
 *   post:
 *     summary: Edit existing customer group
 *     tags: [Customer Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - record_id
 *             properties:
 *               record_id:
 *                 type: string
 *               group_name:
 *                 type: string
 *               country:
 *                 type: string
 *               region:
 *                 type: string
 *               plan:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               license_usage:
 *                 type: integer
 *               no_customer:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Customer group updated successfully
 *       400:
 *         description: Error updating customer group
 */
router.post("/editcustomergroup", authmiddleware,  vouchercontroller.editCustomerGroup);

/**
 * @swagger
 * /voucher/api/v1/customergrouplist:
 *   post:
 *     summary: Get all customer groups
 *     tags: [Customer Group]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer groups retrieved successfully
 *       400:
 *         description: Error retrieving customer groups
 */
router.post("/customergrouplist", authmiddleware,  vouchercontroller.getCustomerGroupList);

/**
 * @swagger
 * /voucher/api/v1/deletecustomergroup:
 *   post:
 *     summary: Delete customer group
 *     tags: [Customer Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - record_id
 *             properties:
 *               record_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer group deleted successfully
 *       400:
 *         description: Error deleting customer group
 */
router.post("/deletecustomergroup", authmiddleware,  vouchercontroller.deleteCustomerGroup);

module.exports = router;