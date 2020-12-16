'use strict';

var GoogleStrategy = require('passport-google-oauth20').Strategy;
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
    callbackURL: process.env.BASE_URL+"/auth/google/callback",
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
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};