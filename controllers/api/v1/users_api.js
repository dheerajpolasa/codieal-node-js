const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

// To create a user session
module.exports.createSession = async function(req, res) {
    try {
        console.log(req.body);
        let user = await User.findOne({email: req.body.email});
        console.log(user.password, req.body.password)
        if(!user || user.password != req.body.password) {
            return res.json(422, {
                message: 'Invalid Username/Password'
            });
        }

        return res.json(200, {
            message: 'Sign In successful, Here is your token, keep it safe',
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '100000'})
            }
        })
    } catch(err){
        console.log('*******', err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}