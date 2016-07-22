var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var db = require('../db.js');
var User = db.User;
var config = require('../../config.js');

passport.use(new GitHubStrategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: 'admin:org, repo'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ githubId: profile.id }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          githubId: profile.id,
          name: profile.displayName,
          email: profile.emails ? profile.emails[0].value : undefined,
          username: profile.username,
          profileUrl: profile.profileUrl,
          accessToken: accessToken
        });
        user.save(function(err) {
          if (err) console.log(err);
          return done(err, user, accessToken);
        });
      } else {
          user.accessToken = accessToken
          user.save(function(err) {
            if (err) console.log(err);
            return done(err, user, accessToken);
          });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});