const router = require('express').Router();
const itineraryController = require('../controller/itinerary');
const validate = require('../utilities/itineraryValidation');

router.get('/', itineraryController.getAll);
router.get('/:id', itineraryController.getSingle);
router.get('/user/:userId', itineraryController.getByUser);
router.get('/destination/:destinationId', itineraryController.getByDestination);

router.post('/', 
    validate.itineraryRules(), 
    validate.checkData, 
    itineraryController.createItinerary
);

router.put('/:id', 
    validate.updateItineraryRules(), 
    validate.checkData, 
    itineraryController.updateItinerary
);

router.delete('/:id', itineraryController.deleteItinerary);

module.exports = router;
