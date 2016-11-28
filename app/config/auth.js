'use strict';

module.exports = {
    'githubAuth': {
        'clientID': process.env.GOOGLE_KEY,
        'clientSecret': process.env.GOOGLE_SECRET,
        'callbackURL': "https://authentication-test-2-hamishivi.c9users.io/auth/google/callback"
    }
};