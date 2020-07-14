const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
// Authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    function(req, email, password, done) {
        // find the user and establish the identity
        User.findOne({email: email}, function(err, user) {
            if(err) {
                req.flash('error', err);
                return done(err);
            }
            if(!user || user.password != password) {
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }
            return done(null, user);
        })
    }
));

// serialize the user to decide which key is to be kept in cookies
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// deserialize the user from key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if(err) {
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        console.log('Retrieved User');
        return done(null, user);
    });
});

// Check if user is authenticated
passport.checkAuthentication = function(req, res, next) {
    // If the user is signed in, then pass the request to the controller
    if(req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        // console.log('Is Authenticated');
        res.locals.user = req.user;
        // console.log('Is Authenticated');
    }
    next();   
}

module.exports = passport;