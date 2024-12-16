/* Using ExpressJS frameword to create a simple REST API using micro services method */
const express = require("express"); // Import the Express module
const app = express();
const PORT = 8007; // Set the port number for the server
require('dotenv').config(); 
const billinghistoryroute = require('./routes/billinghistoryroute.js');
      
app.get('/subscriptionservices',(req,res)=>{
    res.send("We are calling subscription API");
})
app.get('/subscriptionservices/test',(req,res)=>{
    res.send("We Are Calling User Test API");
})
         
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/subscriptionservices/billing/api/v1',billinghistoryroute);

// Start the server and listen on the specified port
app.listen(PORT,()=>{
    console.log("Calling subscription Services run on port: "+PORT);
})    