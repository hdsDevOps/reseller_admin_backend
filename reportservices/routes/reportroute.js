const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const dashboardController = require('../controllers/dashboard_report.js');
const multer = require('multer');
const path = require('path');

// Update a specific notification type status
router.post('/monthly_revenue_data',authMiddleware, dashboardController.getreportdata);

router.post('/yearly_spending_statistics',authMiddleware, dashboardController.yearly_spending_statistics);

 module.exports = router;