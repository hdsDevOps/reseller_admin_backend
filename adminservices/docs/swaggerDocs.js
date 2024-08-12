const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin Services API',
      version: '1.0.0',
      description: 'API documentation for Admin Services',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:8001`, // Update this URL as needed
      },
    ],
  },
  apis: ['./docs/*.js'], // Points to all docs in the docs folder
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
