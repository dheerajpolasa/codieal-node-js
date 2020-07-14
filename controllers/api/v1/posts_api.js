const Post = require('../../../models/post')
const Comment = require('../../../models/comment')
module.exports.index = async function(req, res) {
    let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });
    return res.json(200, {
        message: 'List of posts',
        posts: posts
    });
}

module.exports.destroy = async function(req, res) {
    try {
        let post = await Post.findById(req.params.id);
        console.log(req.user);
        console.log(post.user, req.user.id);
        if(post.user == req.user.id) {
            post.remove();
            await Comment.deleteMany({post: req.params.id})
            return res.json(200, {
                message: 'Post and associate comments deleted'
            });
        } else {
            return res.json(401, {
                message: 'Deletion is not allowed / Unauthorized'
            });
        }
    } catch(err) {
        console.log('**********', err);
        return res.json(500, {
            message: 'Internal server error'
        })
    }
    
}