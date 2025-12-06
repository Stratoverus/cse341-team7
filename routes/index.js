const router = require('express').Router();
const passport = require('passport');


router.get('/', (req, res) => {
    //#swagger.tags=['Landing Page'] 
    res.send(`
      <h1>Lucky 7 Travel Project</h1>
      <p>Endpoint available: </p>
      <ul>
        <li><a href='/users'>Users</a></li>
        <li><a href='/destination'>Destination</a></li>
        <li><a href='/itinerary'>Itinerary</a></li>
        <li><a href='/review'>Review</a></li>
        <li><a href='/api-docs'>API Documentation</a></li>
      </ul>
    `);
});

router.get('/login', passport.authenticate('github'), (req, res) => {})
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if(err) { return next(err); }
        res.redirect('/');
    });
});
router.use('/user', require('./user'));
router.use('/destination', require('./destination'));
router.use('/itinerary', require('./itinerary'));
router.use('/review', require('./review'));
router.use('/', require('./swagger' ))

module.exports = router;