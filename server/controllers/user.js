const User = require('../models/user'),
    config = require('../config/dev'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');

exports.auth = function (req, res) {
    const { mail, password } = req.body;

    if (!password || !mail) {
        return res.status(422).send({ errors: [{ title: 'Data missing', detail: 'Provide email and password' }] });
    }
    User.user_select_one('mail', mail, function (req, result) {
        if (result.length == 0) {
            return res.status(422).send({ errors: [{ title: 'Wrong identification', detail: 'Provided email doesn\'t exist ' }] });
        }
        else {
            User.user_password_check(result[0].id, password, function (cb_result) {
                if (cb_result == false) {
                    return res.status(422).send({ errors: [{ title: 'Wrong identification', detail: 'Wrong password' }] });
                }
                return res.json(jwt.sign({
                    userId: result[0].id,
                    username: result[0].login,
                    userMail: result[0].mail
                }, config.SECRET, { expiresIn: '1h' }));
            });
        }
    });

}

exports.register = function (req, res, next) {

    User.user_new(req, res);

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