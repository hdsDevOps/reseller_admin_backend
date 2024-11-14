/* Using ExpressJS frameword to create a simple REST API using micro services method */
const express = require("express"); // Import the Express module
const app = express();
const PORT = 8001; // Set the port number for the server
var cors = require("cors");

require('dotenv').config();
const helper = require('./helper');
const addEmailToQueue = require('./queue');
const loginroute = require('./routes/loginroute.js');
//const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
//const customerRoutes  = require("./routes/customer_routes.js");
//const adminServicesRoutes = require("./routes/customer_routes.js");
//const adminRoutes = require("./routes/adminRoutes");
//const subscriptionRoutes = require("./routes/subscriptionRoutes");
//const notificationRoutes = require("./routes/notificationRoutes");
//const voucherRoutes = require("./routes/voucherroutes");
   
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});
app.get("/adminservices", (req, res) => {
  res.send("We are calling admin services API");
});

app.get("/test", (req, res) => {
  res.send("We are calling admin services API");
});

app.get("/adminservices/test", (req, res) => {
  res.send("We Are Calling User Test API");
});

app.use("/adminservices", loginroute);
app.post("/adminservices/upload", (req, res) => {
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

app.post("/adminservices/send-email", (req, res) => {
  const { to, subject, text } = req.body;
  addEmailToQueue(to, subject, text);
  res.send("Email queued for sending");
});

//app.use("/adminservices/forgot-password", forgotPasswordRoutes);
//app.use("/adminservices/customers", adminServicesRoutes);

//app.use(`/admin/api/v1`, adminRoutes);
//app.use('/subscription/api/v1', subscriptionRoutes);
//app.use('/notification/api/v1', notificationRoutes);
//app.use('/voucher/api/v1', voucherRoutes);
//app.use('/customer/api/v1', customerRoutes);

  
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log("Calling admin Service running on port "+ PORT);
});
