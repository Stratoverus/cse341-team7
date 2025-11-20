const router = require('express').Router();


router.get('/', (req, res) => {
    //#swagger.tags=["Landing Page"] 
    res.send('Yes, this API is working.');
});




module.exports = router;