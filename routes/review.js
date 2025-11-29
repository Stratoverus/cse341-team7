const router = require('express').Router();
const reviewCtrl = require('../controller/review');

router.get('/', reviewCtrl.getAll);

router.get('/:id', reviewCtrl.getSingle);
router.get('/getByDestination/:id', reviewCtrl.getByDestination);
router.get('/getByUser/:id', reviewCtrl.getByUser);

module.exports = router;