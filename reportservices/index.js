/* Using ExpressJS frameword to create a simple REST API using micro services method */
const express = require("express"); // Import the Express module
const app = express();
const PORT = 8006; // Set the port number for the server
var cors = require('cors');
require('dotenv').config(); 
app.use(cors());
const reportRoute  = require('./routes/reportroute.js');
app.use(express.json());
app.use(
    express.urlencoded({
      extended: true,
    })
  );
app.get('/customerservices',(req,res)=>{
    res.send("We are calling customer users API");
})
  
app.get('/reportservices',(req,res)=>{
    res.send("We are calling report API");
})
     
app.get('/reportservices/test',(req,res)=>{
    res.send("We Are Calling User Test API");
})
app.use('/reportservices/users/api/v1',reportRoute);
// Start the server and listen on the specified port
app.listen(PORT,()=>{
    console.log("Calling report Services");
})    