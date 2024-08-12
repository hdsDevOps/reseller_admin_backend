const express = require("express");
const router = express.Router();
const customerService = require("../services/customerService.js");


/**
 * @swagger
 * /adminservices/customers/add:
 *   post:
 *     summary: Add a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                  Add other customer properties here
 *     responses:
 *       200:
 *         description: Customer added successfully
 *       400:
 *         description: Error adding customer
 */
router.post("/add", async (req, res) => {
  const customerData = req.body;
  res.status(200).send(await customerService.addCustomer(customerData));
});


// Select customer
/**
 * @swagger
 * /adminservices/customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully
 *       400:
 *         description: Error getting customer
 */
router.get("/:id", async (req, res) => {
  const customerId = req.params.id;
  res.status(200).send(await customerService.getCustomer(customerId));
});

// Send notification
/**
 * @swagger
 * /adminservices/customers/notify:
 *   post:
 *     summary: Send a notification to a customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       400:
 *         description: Error sending notification
 */
router.post("/notify", async (req, res) => {
  const { customerId, message } = req.body;
  res
    .status(200)
    .send(await customerService.sendNotification(customerId, message));
});

// Edit customer
/**
 * @swagger
 * /adminservices/customers/{id}:
 *   put:
 *     summary: Edit a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *              Define the properties that can be updated
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Error updating customer
 */
router.put("/:id", async (req, res) => {
  const customerId = req.params.id;
  const updateData = req.body;
  res
    .status(200)
    .send(await customerService.editCustomer(customerId, updateData));
});


// Delete customer
/**
 * @swagger
 * /adminservices/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       400:
 *         description: Error deleting customer
 */
router.delete("/:id", async (req, res) => {
  const customerId = req.params.id;
  res.status(200).send(await customerService.deleteCustomer(customerId));
});

// Cancel subscription
/**
 * @swagger
 * /adminservices/customers/{id}/cancel-subscription:
 *   post:
 *     summary: Cancel a customer's subscription
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription cancelled successfully
 *       400:
 *         description: Error cancelling subscription
 */
router.post("/:id/cancel-subscription", async (req, res) => {
  const customerId = req.params.id;
  res.status(200).send(await customerService.cancelSubscription(customerId));
});

// Suspend account
/**
 * @swagger
 * /adminservices/customers/{id}/suspend:
 *   post:
 *     summary: Suspend a customer's account
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account suspended successfully
 *       400:
 *         description: Error suspending account
 */
router.post("/:id/suspend", async (req, res) => {
  const customerId = req.params.id;
  res.status(200).send(await customerService.suspendAccount(customerId));
});

// Transfer account
/**
 * @swagger
 * /adminservices/customers/{id}/transfer:
 *   post:
 *     summary: Transfer a customer's account
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newOwnerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account transferred successfully
 *       400:
 *         description: Error transferring account
 */
router.post("/:id/transfer", async (req, res) => {
  const customerId = req.params.id;
  const { newOwnerId } = req.body;
  res
    .status(200)
    .send(await customerService.transferAccount(customerId, newOwnerId));
});

/**
 * @swagger
 * /adminservices/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                 totalCount:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       400:
 *         description: Error retrieving customers
 */
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    res.status(200).send(await customerService.getAllCustomers(page, limit));
});

module.exports = router;
