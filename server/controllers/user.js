const User = require('../models/user'),
    config = require('../config/dev'),
    jwt = require('jsonwebtoken');
	axios = require('axios');

exports.register = function (req, res) {
    return User.user_new(req, res);
}

const errorMessages = {
    "dataMissing": [{ title: 'Data missing', detail: 'Provide email and username' }],
    "wrongIdentification": [{ title: 'Wrong identification', detail: 'Oops it seems like this link is no longer valid...' }],
    "accountNotActive": [{ title: 'Account non active', detail: 'Your account hasn\'t been activated yet. Please check your email.' }],
    "wrongPassword": [{ title: 'Wrong identification', detail: 'Wrong password' }],
    "notAuthorized": [{ title: 'Not authorized', detail: 'You need to log in' }],
    "linkInvalid": [{title: 'Wrong identification', detail: 'Oops it seems like this link is no longer valid...'}]

}

exports.activate = function (req, res) {
    const userKey = req.params.key;
    User.user_select_one('key', userKey, function (err, result) {
        if (err) {
            return res.status(422).send({ errors: errorMessages.wrongIdentification })
        }
        if (result.length) {
            User.user_set_active(result[0].id)
        }
        return res.json(result);
    });
}

exports.auth = function (req, res) {
    const {  password } = req.body;
    const username = req.body.username.toLowerCase() ;
    username;
    if (!password || !username) {
        return res.status(422).send({ errors: errorMessages.dataMissing });
    }
    User.user_select_one('username', username, function (req, result) {
        if (result.length == 0) {
            return res.status(422).send({ errors: errorMessages.wrongIdentification });
        }
        else if (result[0].active == '0') {
            return res.status(422).send({ errors: errorMessages.accountNotActive });
        }
        else {
            User.user_password_check(result[0].id, password, function (cb_result) {
                if (cb_result === false) {
                    return res.status(422).send({ errors: errorMessages.wrongPassword });
                }
                else {
                    const userId = result[0].id;
                    axios.get(`http://api.ipstack.com/check?access_key=7b4aac12f356ba32dee5cb0d1dbfa762&format=1`).then((result) => {
						result.json;
                        User.user_set_ip(result.data, userId);
                    }).catch((e) => console.log(e))
                    User.user_set_online('1', result[0].username)
                    return res.json(jwt.sign({
                        userId: userId,
                        username: result[0].username
                    }, config.SECRET, { expiresIn: '1h' }));
                }
            });
        }
    });

}

exports.authMiddleware = function (req, res, next) {
    const token = req.headers.authorization;
    console.log(token)
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
    return res.status(401).send({ errors: errorMessages.notAuthorized });
}

exports.fetchAllUsersData = function (req, res, next) {
    // Public Data to be defined
    User.user_select_all_public_data(function (err, result) {
        if (err) {
            return res.status(422).send({ errors: errorMessages.dataMissing })
        }
        return res.status(200).send(result);
    });
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
