const express = require("express");
const adminServicesRouter = express.Router();
const router = express.Router();
const CustomerService = require("../services/CustomerService.js");
const authMiddleware = require("../middleware/auth");
const CustomerController = require("../controllers/CustomerController.js");

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
adminServicesRouter.post("/add", async (req, res) => {
  const customerData = req.body;
  res.status(200).send(await CustomerService.addCustomer(customerData));
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
adminServicesRouter.get("/:id", async (req, res) => {
  const customerId = req.params.id;
  res.status(200).send(await CustomerService.getCustomer(customerId));
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
adminServicesRouter.post("/notify", async (req, res) => {
  const { customerId, message } = req.body;
  res
    .status(200)
    .send(await CustomerService.sendNotification(customerId, message));
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
adminServicesRouter.put("/:id", async (req, res) => {
  const customerId = req.params.id;
  const updateData = req.body;
  res
    .status(200)
    .send(await CustomerService.editCustomer(customerId, updateData));
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
adminServicesRouter.delete("/:id", async (req, res) => {
  const customerId = req.params.id;
  res.status(200).send(await CustomerService.deleteCustomer(customerId));
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
adminServicesRouter.post("/:id/cancel-subscription", async (req, res) => {
  const customerId = req.params.id;
  res.status(200).send(await CustomerService.cancelSubscription(customerId));
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
adminServicesRouter.post("/:id/suspend", async (req, res) => {
  const customerId = req.params.id;
  res.status(200).send(await CustomerService.suspendAccount(customerId));
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
adminServicesRouter.post("/:id/transfer", async (req, res) => {
  const customerId = req.params.id;
  const { newOwnerId } = req.body;
  res
    .status(200)
    .send(await CustomerService.transferAccount(customerId, newOwnerId));
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
adminServicesRouter.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    res.status(200).send(await CustomerService.getAllCustomers(page, limit));
});




/**
 * @swagger
 * /customer/api/v1/customerlist:
 *   post:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers retrieved successfully
 *       400:
 *         description: Error retrieving customers
 */
router.post("/customerlist", authMiddleware, CustomerController.getCustomerList);


/**
 * @swagger
 * /customer/api/v1/addcustomer:
 *   post:
 *     summary: Add new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               address:
 *                 type: string
 *               state_name:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               phone_no:
 *                 type: string
 *               email:
 *                 type: string
 *               authentication:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer added successfully
 *       400:
 *         description: Error adding customer
 */
router.post("/addcustomer", authMiddleware, CustomerController.addCustomer);

/**
 * @swagger
 * /customer/api/v1/editcustomer:
 *   post:
 *     summary: Edit existing customer
 *     tags: [Customers]
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
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               address:
 *                 type: string
 *               state_name:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               phone_no:
 *                 type: string
 *               email:
 *                 type: string
 *               authentication:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Error updating customer
 */
router.post("/editcustomer", authMiddleware, CustomerController.editCustomer);

/**
 * @swagger
 * /customer/api/v1/deletecustomer:
 *   post:
 *     summary: Delete customer
 *     tags: [Customers]
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
 *         description: Customer deleted successfully
 *       400:
 *         description: Error deleting customer
 */
router.post("/deletecustomer", authMiddleware, CustomerController.deleteCustomer);

/**
 * @swagger
 * /customer/api/v1/suspendcustomer:
 *   post:
 *     summary: Suspend customer
 *     tags: [Customers]
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
 *         description: Customer suspended successfully
 *       400:
 *         description: Error suspending customer
 */
router.post("/suspendcustomer", authMiddleware, CustomerController.suspendCustomer);

/**
 * @swagger
 * /customer/api/v1/cancelsubscriptioncustomer:
 *   post:
 *     summary: Cancel customer subscription
 *     tags: [Customers]
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
 *         description: Customer subscription cancelled successfully
 *       400:
 *         description: Error cancelling customer subscription
 */
router.post("/cancelsubscriptioncustomer", authMiddleware, CustomerController.cancelSubscription);










module.exports = {
  adminServicesRoutes: adminServicesRouter,
  customerRoutes: router
};