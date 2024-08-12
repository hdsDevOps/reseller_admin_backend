/* Using ExpressJS frameword to create a simple REST API using micro services method */
const express = require("express"); // Import the Express module
const app = express();
const PORT = 8001; // Set the port number for the server
var cors = require('cors');
require('dotenv').config();
const helper = require('./helper');
const addEmailToQueue = require('./queue');
const adminCredentialsRoute  = require('./routes/loginroute.js');

// Add these lines
const swaggerJsDoc = require("swagger-jsdoc"); 
const swaggerUi = require("swagger-ui-express"); 

// Add this block
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Admin Services API",
      description: "Admin Services API Information",
      version: "1.0.0",
      contact: {
        name: "API Support",
        email: "support@example.com"
      },
      servers: [{ url: `http://localhost:${PORT}` }]
    }
  },
  apis: ["./index.js", "./routes/loginroute.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Add this line
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
      extended: true,
    })
  );


/**
 * @swagger
 * /adminservices:
 *   get:
 *     summary: Get admin services message
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/adminservices',(req,res)=>{
    res.send("We are calling admin services API");
})

app.get('/test',(req,res)=>{
    res.send("We are calling admin services API");
})

app.get('/adminservices/test',(req,res)=>{
    res.send("We Are Calling User Test API");
})

app.use('/adminservices',adminCredentialsRoute);
app.post('/adminservices/upload', (req, res) => {
  const uploadPath = 'uploads'; // Define your upload path here
  const fieldName = 'file'; // Define the field name in the form
  const upload = helper.file_upload(uploadPath, fieldName);
  upload(req, res, function (err) {
      if (err) {
          return res.status(400).send(err.message);
      }
      res.send('File uploaded successfully');
  });
});

app.post('/adminservices/send-email', (req, res) => {
    const { to, subject, text } = req.body;
    addEmailToQueue(to, subject, text);
    res.send('Email queued for sending');
});

// Start the server and listen on the specified port
app.listen(PORT,()=>{
    console.log("Calling admin Service");
})