import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'GupShup API',
    description: 'API documentation for GupShup',
  },
  host: 'localhost:7000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; // Entry point to your routes

swaggerAutogen(outputFile, endpointsFiles, doc);