const router = require('express').Router();
const reviewCtrl = require('../controller/review');

router.get('/', reviewCtrl.getAll);

module.exports = router;