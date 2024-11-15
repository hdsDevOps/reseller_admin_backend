/* Using ExpressJS frameword to create a simple REST API using micro services method */
const express = require('express');// Import the Express module
const { createProxyMiddleware } = require('http-proxy-middleware');// Import the http-proxy-middleware module
const PORT = 8000;// Set the port number for the server
var cors = require('cors');
const app = express();
   
app.use(cors({
    origin: '*', // Replace with your frontend URL
    methods: 'GET, POST', // Specify allowed HTTP methods
    credentials: true, // Allow cookies and authentication headers
  }));
  
// Define the routes for the micro services
const routes = {
    '/adminservices':"https://adminapi.admin.gworkspace.withhordanso.com",
    '/customerservices':"https://customerapi.admin.gworkspace.withhordanso.com",
    //'/googleservices':"http://googleservices:8003",
    //'/miscservices':"http://miscservices:8004",
    //'/notificationservices':"http://notificationservices:8005",
    //'/reportservices':"http://reportservices:8006",
    //'/subscriptionservices':"http://subscriptionservices:8007",
    '/voucherservices':"https://voucherapi.admin.gworkspace.withhordanso.com",
}


for(const route in routes){
    const target = routes[route];
    app.use(route, createProxyMiddleware({
        target,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',  // Enable debug logging
        onProxyReq: (proxyReq, req, res) => {
            console.log(`Proxying request: ${req.method} ${req.url} to ${target}`);
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log(`Response from ${target}: ${proxyRes.statusCode}`);
        },
    }));
}
// Check if the middleware is called
app.use(function (req, res, next) {
    console.log("Middleware called")
    next();
});
// This is a sample route for testing
app.get('/Test', function (req, res) {
    res.send('Welcome to hordanso micro services');
});

// Start the server and listen on the specified port
app.listen(PORT,()=>{
    console.log("API GATEWAY SERVICE RUNNING ON PORT "+PORT);
});