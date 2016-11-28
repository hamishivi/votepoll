'use strict';

var path = process.cwd();

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