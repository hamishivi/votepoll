'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    name: String,
    votes: [],
    creator: String,
    url: String
    });

module.exports = mongoose.model('Poll', Poll);