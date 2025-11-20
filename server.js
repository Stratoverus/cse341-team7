const express = require('express');
const mongodb = require('./data/database.js');
const app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json');

const port = process.env.PORT || 3000;

app
    .use(express.json())
    .use('/', require('./routes'))
    .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening with node running on port ${port}`)});
    }
})