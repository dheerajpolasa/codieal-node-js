 const User = require('../models/user');
 const Post = require('../models/post');
//  const async = require('async');
 module.exports.home = async function(req, res) {
    //  console.log(req.cookies);
    //  console.log(req.user);
    //  res.cookie('user', 25);
        // Post.find({}, function(err, posts) {
        //     console.log(posts)
        //     return res.render('home', {
        //         title: 'DP | Home',
        //         posts: posts
        //     });
        // })
        // Post.find({}).populate('user').populate({
        //     path: 'comments',
        //     populate: {
        //         path: 'user'
        //     }
        // }).exec(function(err, posts) {

        //     User.find({}, function(err, users) {
        //         return res.render('home', {
        //             title: 'DP | Home',
        //             posts: posts,
        //             all_users: users
        //         });
        //     });
        // })
        try {
            let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });
            
            let users = await User.find({});

            return res.render('home', {
                title: 'DP | Home',
                posts: posts,
                all_users: users
            });
        } catch(err) {
            console.log('Error', err);
            return;
        }
 }