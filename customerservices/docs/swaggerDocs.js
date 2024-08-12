const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customer Service API',
      version: '1.0.0',
      description: 'API documentation for Customer Services',
    },
    servers: [
      {
        url: 'http://localhost:8002', // Replace with your production URL as needed
      },
    ],
  },
  apis: ['./docs/*.js'], // Include all docs files for Swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
