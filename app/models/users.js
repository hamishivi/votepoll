'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    google: {
        id: String,
        displayName: String,
        email: String,
    },
   polls: []
});

module.exports = mongoose.model('User', User);