const express = require('express');
const router = express.Router();
const billingservice = require('../services/billingservice.js');
const { verifyToken } = require('../middleware/auth.js');
      
// Get all the voucher List excluding Deleted records
router.post('/billinghistory',verifyToken, async (req, res) => {
    res.status(200).send(await billingservice.getrecordlist(req.body));
})
  

    
module.exports = router;