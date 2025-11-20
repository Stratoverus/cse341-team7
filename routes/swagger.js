const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');


delete swaggerDocument.host;
delete swaggerDocument.schemes;


router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
module.exports = router;