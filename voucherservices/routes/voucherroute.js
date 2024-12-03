const express = require('express');
const router = express.Router();
const voucherservice = require('../services/voucherservice.js');
const { verifyToken } = require('../middleware/auth');
      
// Get all the voucher List excluding Deleted records
router.post('/voucherlist', async (req, res) => {
    //const { email, password } = req.body;
    res.status(200).send(await voucherservice.getVoucherList(req.body));
})
  
router.post('/addnewvoucher',verifyToken, async (req, res) => {
    //const { email, password } = req.body;
    res.status(200).send(await voucherservice.addnewvoucher(req.body));
})

router.post('/editvoucher',verifyToken, async (req, res) => {
    //const { email, password } = req.body;
    res.status(200).send(await voucherservice.editvoucher(req.body));
})

router.post('/deletevoucher',verifyToken, async (req, res) => {
    //const { email, password } = req.body;
    res.status(200).send(await voucherservice.deletevoucher(req.body));
})

router.post('/sendvochermail',verifyToken, async (req, res) => {
    res.status(200).send(await voucherservice.sendvochermail(req.body));
})
    
module.exports = router;