const User = require('../models/user');
const Post = require('../models/post');

const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        return res.render('user_profile', {
            title: "User Profile",
            profile_user: user
        });
    })
}

module.exports.update = async function(req, res) {
    // if(req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    //         return res.redirect('back');
    //     })
    // } else {
    //     return res.status(401).send('Unauthorized');
    // }

    if(req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err) {
                if(err) {console.log('error', err); return;}

                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file) {
                    if(user.avatar) {
                        fs.unlinkSync(path.join(__dirname , '..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })
        } catch(err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized');
        return res.send(401).send('Unauthorized');
    }
}

// render the sign up page
module.exports.signUp = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "DP | Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "DP | Sign In"
    });
}

// To create new user
module.exports.create = function(req, res) {
    if(req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {console.log('Error in finding the user'); return};

        if(!user) {
            User.create(req.body, function(err, user) {
                if(err) {console.log('Error in signing up the user'); return};

                return res.redirect('/users/sign-in');
            });
        }
        console.log(user);
        req.flash('error', 'User already exists');
        return res.redirect('back');
    })
}

// To create a user session
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged In Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    req.logout();
    req.flash('success', 'Logged out Successfully');
    return res.redirect('/');
}

// To sign out the logged in user
module.exports.signOut = function(req, res) {
    
}