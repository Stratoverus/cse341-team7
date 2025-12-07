const express = require('express');
const mongodb = require('./data/database.js');
const app = express();
const session = require('express-session');
const port = process.env.PORT || 3000;
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

app
    .use(bodyParser.json())
    .use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true ,
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
        );
                res.setHeader(
            'Access-Control-Allow-Methods',
            'POST, GET, PUT, DELETE'
        );
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'PUT']}))
    .use('/', require('./routes'))
    
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: ['user:email']
    },
    async function(accessToken, refreshToken, profile, done) {
        try {
            const userCollection = mongodb.getDatabase().db('lucky7Travel').collection('user');
            let user = await userCollection.findOne({ githubId: profile.id });
            if (!user) {
                await userCollection.insertOne({
                    githubId: profile.id,
                    username: profile.username,
                    name: profile.name || profile.username,
                    email: (profile.emails && profile.emails[0] && profile.emails[0].value) || null,
                    role: 'client',
                    createdAt: new Date()
                });
                user = await userCollection.findOne({ githubId: profile.id });
            }
            return done(null, user)
        } catch (error) {
            return done(error);
        }
    }
));
    
passport.serializeUser((user, done) => {
    done(null, user._id);
})
passport.deserializeUser(async (id, done) => {
    try {
        const user = await mongodb.getDatabase()
            .db('lucky7Travel')
            .collection('user')
            .findOne({ _id: new ObjectId(id) });

        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs' }),
    (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});
    
mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening with node running on port ${port}`)});
    }
})

module.exports = app;