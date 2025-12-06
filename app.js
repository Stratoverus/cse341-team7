const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const mongodb = require("./data/database.js");

const app = express();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userCollection = mongodb.getDatabase().db("lucky7Travel").collection("user");
      let user = await userCollection.findOne({ githubId: profile.id });

      if (!user) {
        const newUser = {
          githubId: profile.id,
          username: profile.username,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          role: "user"
        };
        const response = await userCollection.insertOne(newUser);
        user = { ...newUser, _id: response.insertedId };
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await mongodb.getDatabase().db("lucky7Travel").collection("user").findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app
    .use(express.json())
    .use(session({
        secret: process.env.SESSION_SECRET || "secretKey",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // set to true when we need to used https
    }))

    .use("/", require("./routes"))

module.exports = app;
