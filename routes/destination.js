
const router = require('express').Router();

const destinationController = require('../controller/destination');
const destinationValidation = require('../utilities/destinationValidation');

const { isAuthenticated } = require('../utilities/userAuthentication');

router.get('/', destinationController.getAll);

router.get('/findByCountry/:country', destinationController.getAllByCountry);

router.get('/findByTags/:tag', destinationController.getAllByTag);

router.get('/:id', destinationController.getSingle);

router.post('/', isAuthenticated, destinationValidation.destinationInformation(), destinationValidation.destinationResult, destinationController.addDestination);

router.put('/:id', isAuthenticated, destinationValidation.destinationUpdateInformation(), destinationValidation.destinationResult, destinationController.updateDestination);

router.delete('/:id', isAuthenticated, destinationController.deleteDestination);

module.exports = router;