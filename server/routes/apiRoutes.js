var express = require('express');
var router = express.Router();
var Octokat = require('octokat');
var fetch = require('isomorphic-fetch');
var passportServices = require('../authentication/passport-services.js');
var passport = require('passport');
var path = require('path');
var db = require('../db.js');
var User = db.User;

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.get('/user/:id', function(req, res) {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'profile.html'))
  });

  app.get('/auth/github',
    passport.authenticate('github'));

  app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/auth/github' }),
    function(req, res) {
      res.redirect('/user/' + req.user.githubId)
    });

  app.get('/user/:id/profile', function(req, res) {
    User.findOne({ githubId: req.params.id}, function(err, user) {
      if (err) {
        res.send(err)
      } 
      else {
        var octo = new Octokat({
          token: user.accessToken
        });
        octo.fromUrl('https://api.github.com/user/teams?access_token=' + user.accessToken).fetch()
          .then(teams => {
            for (var i = 0; i < teams.items.length; i++) {
              if (teams.items[i].organization.login === 'TelegraphPrep') {
                octo.fromUrl('https://api.github.com/teams/' + teams.items[i].id + '/repos?per_page=1000&access_token=' + user.accessToken).fetch()
                .then(repos => repos.fetchAll())
                .then(all => {
                  console.log('number of repos',all.length)
                  if (all.length > 600 ){ 
                    res.send(all)
                  }
                })
              }
            }
          });
      }
    });
  });

  app.get('/user/:id/:owner/:repo', function(req, res) {
    User.findOne({ githubId: req.params.id}, function(err, user) {
      if (err) {
        res.send(err)
      } else {
        var url = 'https://api.github.com/repos/' + req.params.owner + '/' + req.params.repo + '/readme?access_token=' + user.accessToken
        fetch(url)
          .then(res => res.json())
          .then(json => res.send(json))
      }
    })
  });
};
