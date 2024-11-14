/* Using ExpressJS frameword to create a simple REST API using micro services method */
const express = require("express"); // Import the Express module
const app = express();
const PORT = 8008; // Set the port number for the server
const voucherroute = require('./routes/voucherroute');

app.get('/voucherservices',(req,res)=>{
    res.send("We are calling voucher services API");
})
           
app.get('/voucherservices/test',(req,res)=>{
    res.send("We Are Calling Vouchers Test API by");
}) 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/voucherservices/voucher/api/v1',voucherroute);

// Start the server and listen on the specified port
app.listen(PORT,()=>{
    console.log("Calling voucher Services. Server running on port " + PORT);
})