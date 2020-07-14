const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codeial'  
}

passport.use(new JWTStrategy(opts, function(jwtPayload, done) {
    console.log(jwtPayload);
    User.findById(jwtPayload._id, function(err, user) {
        if(err) {console.log('Error in finding user'); return;}
        console.log(user);
        if(user) {
            return done(null, user);
        }

        return done(null, false);
    })
}));

module.exports = passport;