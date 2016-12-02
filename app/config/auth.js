'use strict';

module.exports = {
    'googleAuth': {
        'clientID': process.env.GOOGLE_KEY,
        'clientSecret': process.env.GOOGLE_SECRET,
        'callbackURL': "https://votepolling.herokuapp.com/auth/google/callback"
    }
};