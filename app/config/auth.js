'use strict';

module.exports = {
    'googleAuth': {
        'clientID': process.env.GOOGLE_KEY,
        'clientSecret': process.env.GOOGLE_SECRET,
        'callbackURL': process.env.BASE_URL+"/auth/google/callback"
    }
};