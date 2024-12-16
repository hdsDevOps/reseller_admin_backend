/* Using ExpressJS frameword to create a simple REST API using micro services method */
const express = require("express"); // Import the Express module
const app = express();
const PORT = 8001; // Set the port number for the server
var cors = require("cors");

require('dotenv').config();
const helper = require('./helper');
const addEmailToQueue = require('./queue');
const loginroute = require('./routes/loginroute.js');
const forgotpasswordroutes = require('./routes/forgotpasswordroute.js');
const customerroutes  = require('./routes/customer_route.js');
const adminservicesroutes = require('./routes/customer_route.js');
const adminroutes = require('./routes/adminroute');
const subscriptionroutes = require('./routes/subscriptionroute');
const notificationroutes = require('./routes/notificationroute');
const voucherroutes = require('./routes/voucherroute.js');
const userroutes = require('./routes/userroute.js');
const roleroutes = require('./routes/roleroute.js');

      
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.redirect("/api-docs");
});
app.get('/adminservices', (req, res) => {
  res.send("We are calling admin services API");
});

app.get('/test', (req, res) => {
  res.send("We are calling admin services API");
});

app.get('/adminservices/test', (req, res) => {
  res.send("We Are Calling admin Test API");
});

app.use('/adminservices', loginroute);
app.post('/adminservices/upload', (req, res) => {
  const uploadPath = "uploads"; // Define your upload path here
  const fieldName = "file"; // Define the field name in the form
  const upload = helper.file_upload(uploadPath, fieldName);
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.send("File uploaded successfully");
  });
});
    
app.post('/adminservices/send-email', (req, res) => {
  const { to, subject, text } = req.body;
  addEmailToQueue(to, subject, text);
  res.send("Email queued for sending");
});
    
app.use('/adminservices/forgotpassword/api/v1', forgotpasswordroutes);
app.use('/adminservices/customers', adminservicesroutes);

app.use('/adminservices/admin/api/v1', adminroutes);
app.use('/adminservices/subscription/api/v1', subscriptionroutes);
app.use('/adminservices/notification/api/v1', notificationroutes);
app.use('/adminservices/voucher/api/v1', voucherroutes);
app.use('/adminservices/customer/api/v1', customerroutes);
app.use('/adminservices/users/api/v1', userroutes);
app.use('/adminservices/users/api/v1', roleroutes);
      
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log("Calling admin Service running on port "+ PORT);
});
