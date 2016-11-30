'use strict';

var path = process.cwd();
var bodyParser = require('body-parser');
var Poll = require('../models/polls');

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
        res.locals.login = req.isAuthenticated();
        res.render(path + '/public/index.ejs');
    });
    
    app.route('/login')
    .get(function (req, res) {
        res.sendFile(path + '/public/login.html');
    });
    
    app.route('/logout')
    .get(function (req, res) {
        req.logout();
        res.redirect('/login');
    });
    
    app.route('/profile')
    .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/profile.html');
    });
    
    app.route('/newpoll')
    .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/newpoll.html');
    });
    
    app.route('/createpoll')
    .get(isLoggedIn, function (req, res) {
        var name = req.query.name;
        var options = req.query.options.split('\n');
        var newPoll = Poll();
        newPoll.name = name;
        newPoll.options = options
        var votes = Array.apply(null, Array(options.length)).map(Number.prototype.valueOf,0);
        newPoll.votes = votes;
        newPoll.save(function (err) {
            if (err) {
                throw err;
            }
            res.send(req.body)
        });
    });
    
    //app.route('/poll/:id')
    //Display the poll!
    
    app.route('/api/:id')
    .get(isLoggedIn, function (req, res) {
        res.json(req.user.google);
    });
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: [
       'profile',
       'email'] 
}));
    
    app.route('/auth/google/callback')
    .get(passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

};