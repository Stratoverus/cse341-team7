const router = require('express').Router();
const reviewCtrl = require('../controller/review');
const { reviewRules } = require('../utilities/reviewValidation');
const { isAuthenticated } = require('../utilities/userAuthentication');

router.get('/', reviewCtrl.getAll);

router.get('/getByDestination/:id', reviewCtrl.getByDestination);

router.get('/getByUser/:id', reviewCtrl.getByUser);

router.get('/:id', reviewCtrl.getSingle);

router.post('/', isAuthenticated, reviewRules, reviewCtrl.createReview);

router.put('/:id', isAuthenticated, reviewRules, reviewCtrl.updateReview);

router.delete('/:id', isAuthenticated, reviewCtrl.deleteReview);

module.exports = router;