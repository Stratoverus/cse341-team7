const router = require('express').Router();


router.get('/', (req, res) => {
    //#swagger.tags=["Landing Page"] 
    res.send('Yes, this API is working.');
});

router.use("/user", require("./user"));
router.use("/destination", require("./destination"));
router.use("/", require("./swagger"));

module.exports = router;