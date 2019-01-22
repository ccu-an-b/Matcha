const   User = require('../models/user'),
        config = require('../config/dev'),
        jwt = require('jsonwebtoken');

exports.register = function (req, res) {
    return User.user_new(req, res);
}

exports.activate = function (req, res){
    const userKey= req.params.key;
    User.user_select_one('key', userKey, function(err, result){
        if (err){
            return res.status(422).send({errors: [{title: 'Wrong identification', detail: 'Oops it seems like this link is no longer valid...'}]})
        }
        if (result.length)
        {
            User.user_set_active(result[0].id)
        }
        return res.json(result);
    });
}

exports.auth = function (req, res) {
    const { username, password } = req.body;
    username;
    if (!password || !username) {
        return res.status(422).send({ errors: [{ title: 'Data missing', detail: 'Provide email and username' }] });
    }
    User.user_select_one('username', username, function (req, result) {
        if (result.length == 0 ) {
            return res.status(422).send({ errors: [{ title: 'Wrong identification', detail: 'The provided username doesn\'t exist ' }] });
        }
        else if (result[0].active == '0' ) {
            return res.status(422).send({ errors: [{ title: 'Account non active', detail: 'Your account hasn\'t been activated yet. Please check your email.' }] });
        }
        else {
            User.user_password_check(result[0].id, password, function (cb_result) {
                if (cb_result == false) {
                    return res.status(422).send({ errors: [{ title: 'Wrong identification', detail: 'Wrong password' }] });
                }
                else {
                    User.user_set_online('1',result[0].id)
                    User.user_check_profile_status(result[0].id, function (complete)
                    {
                        return res.json(jwt.sign({
                            userId: result[0].id,
                            username : result[0].username,
                            userProfileStatus : complete,
                        }, config.SECRET, { expiresIn: '1h' }));
                    })
                }
            });
        }
    });

}

exports.authMiddleware = function (req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        const user = parseToken(token);
        User.user_select_one('id', user.userId, function (err, cb) {
            if (cb.length != 0) {
                res.locals.user = user;
                next();
            }
            else
                return notAuthorized(res);
        });
    }
    else
        return notAuthorized(res);
}

function parseToken(token) {
    return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res) {
    return res.status(401).send({ errors: [{ title: 'Not authorized', detail: 'You need to log in' }] });
}

exports.getProfile = function(req, res) {
    const username = req.params.username ;
   
    User.user_get_profile(username, function (req, result) {
        User.get_tags(result, function(req, tags){
            User.user_get_tags(tags, function(req, userTags){
                User.user_get_images(userTags, function(req, finalResult){
                    res.json(finalResult)
                })
            })
        })
    })
}