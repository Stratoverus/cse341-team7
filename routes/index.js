const router = require('express').Router();


router.get('/', (req, res) => {
    //#swagger.tags=["Landing Page"] 
    res.send(`
      <h1>Lucky 7 Travel Project</h1>
      <p>Endpoint availables: </p>
      <ul>
        <li><a href="/user">User</a></li>
        <li><a href="/destination">Destination</a></li>
        <li><a href="/itinerary">Itinerary</a></li>
        <li><a href="/review">Review</a></li>
        <li><a href="/api-docs">API Documentation</a></li>
      </ul>
    `);
});

router.use("/user", require("./user"));
router.use("/destination", require("./destination"));
router.use("/review", require("./review"));
router.use("/", require("./swagger"));

module.exports = router;