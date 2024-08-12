const express = require("express");
const router = express.Router();
const customerService = require('../services/customerService.js');

// Add customer
router.post('/add', async (req, res) => {
    const customerData = req.body;
    res.status(200).send(await customerService.addCustomer(customerData));
});

// Select customer
router.get('/:id', async (req, res) => {
    const customerId = req.params.id;
    res.status(200).send(await customerService.getCustomer(customerId));
});

// Send notification
router.post('/notify', async (req, res) => {
    const { customerId, message } = req.body;
    res.status(200).send(await customerService.sendNotification(customerId, message));
});

// Edit customer
router.put('/:id', async (req, res) => {
    const customerId = req.params.id;
    const updateData = req.body;
    res.status(200).send(await customerService.editCustomer(customerId, updateData));
});

// Delete customer
router.delete('/:id', async (req, res) => {
    const customerId = req.params.id;
    res.status(200).send(await customerService.deleteCustomer(customerId));
});

// Cancel subscription
router.post('/:id/cancel-subscription', async (req, res) => {
    const customerId = req.params.id;
    res.status(200).send(await customerService.cancelSubscription(customerId));
});

// Suspend account
router.post('/:id/suspend', async (req, res) => {
    const customerId = req.params.id;
    res.status(200).send(await customerService.suspendAccount(customerId));
});

// Transfer account
router.post('/:id/transfer', async (req, res) => {
    const customerId = req.params.id;
    const { newOwnerId } = req.body;
    res.status(200).send(await customerService.transferAccount(customerId, newOwnerId));
});

module.exports = router;