'use strict';

var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    
    passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_KEY,
    clientSecret: process.env.GOOGLE_SECRET,
    //NOTE :
    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/ 
    //then edit your /etc/hosts local file to point on your private IP. 
    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
    //if you use it.
    callbackURL: "https://votepolling.herokuapp.com/auth/google/callback",
    passReqToCallback   : true
  },
    function (request, accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(profile.email);
            User.findOne({ 'google.id': profile.id }, function (err, user) {
                if (err) {
                    return done(err);
                }

               if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.google.id = profile.id;
                    newUser.google.email = profile.email;
                    newUser.google.displayName = profile.displayName;

                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};