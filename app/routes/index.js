'use strict';

var path = process.cwd();
var Poll = require('../models/polls');
var User = require('../models/users');
var mongoose = require('mongoose');

// Just use the default promise library
mongoose.Promise = global.Promise;

module.exports = function (app, passport) {

    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
    
    app.set('view engine', 'ejs');


    app.route('/')
    .get(function (req, res) {
        Poll.find({}, function(err, polls){
            if (!err) {
                res.locals.polls = polls.reverse(); // we want most recent first
                res.locals.login = req.isAuthenticated();
                res.render(path + '/public/index.ejs');
            }
        });
    });
    
    app.route('/login')
    .get(function (req, res) {
        res.sendFile(path + '/public/login.html');
    });
    
    app.route('/logout')
    .get(function (req, res) {
        req.logout();
        res.redirect('/');
    });
    
    // vars needed:polls
    app.route('/profile')
    .get(isLoggedIn, function (req, res) {
        User.findOne({'google.email': req.user.google.email})
        .exec(function (err, result) {
            if (!err) {
                res.locals.polls = result.polls;
            }
        res.render(path + '/public/profile.ejs');
        });
    });
    
    app.route('/newpoll')
    .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/newpoll.html');
    });
    
    app.route('/createpoll')
    .get(isLoggedIn, function (req, res) {
        var name = req.query.name;
        var url = name.hashCode();
        var options = req.query.options.split('\n');
        for (var i = 0; i < options.length; i++) {
            options[i] = options[i].replace(/\r/g, ""); // remove return characters
        }
        var newPoll = Poll();
        newPoll.name = name;
        newPoll.creator = req.user.google.email;
        User.findOne({'google.email': req.user.google.email})
        .exec(function (err, result) {
            if (err) return err;
            result.polls.push({"name":name, "url":url});
            result.save(function(err, done){
                if (err) return err;
            });
        });
        newPoll.url = url;
        var votes = [];
        for (i in options){
            var k = options[i];
            votes.push({"voteName":k, vote:0});
        }
        newPoll.votes = votes;
        newPoll.save(function (err) {
            if (err) {
                throw err;
            }
            res.redirect('/poll/'+url);
        });
    });
    
    app.route('/addvote')
    .get(function (req, res) {
        var url = req.query.url;
        var vote = req.query.vote;
        var newVote = true;
        Poll.findOne({'url':url})
        .exec(function (err, result) {
            if (err) throw err;
            // Voted for an option that already exists: update the vote count
            for (var i = 0; i < result.votes.length; i++) {
                if (result.votes[i].voteName == vote) {
                    var ll = {'voteName':result.votes[i].voteName, 'vote':result.votes[i].vote+1};
                    result.votes.splice(i, 1);
                    result.votes.push(ll);
                    newVote = false;
                    break;
                }
            }
            // New vote, so add it to the list
            if (newVote) {
                var nvote ={"vote":1, "voteName":vote};
                result.votes.push(nvote);
            }
            // Save and redirect
            result.markModified('result');
            result.save(function (err, updatedVersion) {
                if (err) console.log(err);
                res.redirect('/poll/'+url);
            });
        });
    });
    
    app.route('/poll/:id')
    .get(function (req, res) {
        res.locals.login = req.isAuthenticated();
         Poll.findOne({'url':req.params.id}, { '_id': false })
        .exec(function (err, result) {
            if (!result || err) { res.send("404: Poll does not exist or we encountered some other error.")}
            res.locals.name = result.name;
            res.locals.hashbrown = result.url; // just my fun name for the poll name hash
            res.locals.options = [];
            res.locals.votes = [];
            // Fill up the votes and options
            for (var i = 0; i < result.votes.length; i++) {
                res.locals.options[i] =  result.votes[i].voteName.replace(/\r/g,'');
                res.locals.votes[i] =result.votes[i].vote;
            }
            res.locals.colors =fillColours(result.votes.length);
            res.locals.user = (req.user && result.creator == req.user.google.email);
                   
            res.setHeader('content-type', 'text/html');
            res.render(path + '/public/poll.ejs');
        });
    });

    app.route('/poll/delete/:url')
    .get(function(req, res){
        Poll.findOne({'url': req.params.url})
        .exec(function (err, doc) { 
            if (err) return err;
            if (req.user && req.user.google.email == doc.creator) doc.remove(); 
            res.redirect('/');
        });
    });

    
    app.route('/api/:id')
    .get(isLoggedIn, function (req, res) {
        res.json(req.user.google);
    });

    // All the auth stuff
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/userinfo.email'] }));
    app.route('/auth/google/callback')
    .get(passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

};

// Helper function for colours
function fillColours(len) {
    var list = ["#3498db", "#9b59b6", "#34495e", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6"];
    if (len <= 7){
        return list;
    }
    var res = [];
    for (var i = 0; i < len; i++) {
        res.push('#'+Math.floor(Math.random()*16777215).toString(16));
    }
    return res;
}

// My little hashcode function, shamelessly stolen from stackoverflow
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};