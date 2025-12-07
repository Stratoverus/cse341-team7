require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Lucky 7 Travel Project',
    description: 'This is team 7s final project for cse 341.'
  },
  components: {
    securitySchemes: {
      githubOAuth: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://github.com/login/oauth/authorize',
            tokenUrl: 'https://github.com/login/oauth/access_token',
            scopes: {
              'user:email': 'Access user email'
            }
          }
        }
      }
    }
  },
  security: [
    {
      githubOAuth: ['user:email']
    }
  ]
};

const outputFile = './swagger-output.json';
const routes = [
  './routes/index.js',
];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('./server.js'); // Your project's root file
});