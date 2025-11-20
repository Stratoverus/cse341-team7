require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Lucky 7 Travel Project',
    description: 'This is team 7s final project for cse 341.'
  }
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('./server.js'); // Your project's root file
});