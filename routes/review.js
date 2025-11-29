const router = require('express').Router();
const reviewCtrl = require('../controller/review');
const { reviewRules } = require('../utilities/reviewValidation');

router.get('/', reviewCtrl.getAll);

router.get('/:id', reviewCtrl.getSingle);

router.get('/getByDestination/:id', reviewCtrl.getByDestination);

router.get('/getByUser/:id', reviewCtrl.getByUser);

router.post('/', reviewRules, reviewCtrl.createReview);

router.put('/:id', reviewRules, reviewCtrl.updateReview);

router.delete('/:id', reviewCtrl.deleteReview);

module.exports = router;