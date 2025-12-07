const router = require('express').Router();
const itineraryController = require('../controller/itinerary');
const validate = require('../utilities/itineraryValidation');
const { isAuthenticated } = require('../utilities/userAuthentication');


router.get('/', itineraryController.getAll);
router.get('/:id', itineraryController.getSingle);
router.get('/user/:userId', itineraryController.getByUser);
router.get('/destination/:destinationId', itineraryController.getByDestination);

router.post('/', 
    isAuthenticated,
    validate.itineraryRules(), 
    validate.checkData, 
    itineraryController.createItinerary
);

router.put('/:id', 
    isAuthenticated,
    validate.updateItineraryRules(), 
    validate.checkData, 
    itineraryController.updateItinerary
);

router.delete('/:id', 
    isAuthenticated,
    itineraryController.deleteItinerary);

module.exports = router;
