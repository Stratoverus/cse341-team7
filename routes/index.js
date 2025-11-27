const router = require('express').Router();


router.get('/', (req, res) => {
    //#swagger.tags=["Landing Page"] 
    res.send('Yes, this API is working.');
});
router.use('/destination', require('./destination'));
router.use('/itinerary', require('./itinerary'));
router.use('/review', require('./review'));
router.use('/user', require('./user'));



module.exports = router;