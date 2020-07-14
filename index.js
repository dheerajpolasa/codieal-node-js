const express = require('express');
const port = 8080;
const path = require('path');
const expressLayouts = require('express-ejs-layouts')
const expressPartials = require('express-partial');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const db = require('./config/mongoose');

// used for session cookie 
const session = require('express-session')
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy')
const passportJwt = require('./config/passport-jwt-strategy')
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const app = express();


app.use(expressLayouts)
app.use(expressPartials())
// use express router
app.use(sassMiddleware({
    src: './assests/scss',
    dest: './assests/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))
app.use(express.urlencoded());
app.use(cookieParser())
// make the uploads available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('assests'));

// mongo store is used to store cookie in db
app.use(session({
    name: 'Codeial',
    // TODO Change the secret before deploying it in production
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }, function(err) {
        if(err) {
            console.log('Error in Mongo store');
            return;
        }
        console.log('Working')
    })
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use('/', require('./routes'));

app.listen(port, function(err) {
    if(err) {
        console.log('Error while listening to port: ', port);
        console.log(err);
        return;
    }
    console.log('Yup, server is running on port: ', port);
})