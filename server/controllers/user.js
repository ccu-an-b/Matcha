const   User = require('../models/user'),
        config = require('../config/dev'),
        jwt = require('jsonwebtoken'),
        axios = require('axios');

exports.register = function (req, res) {
    return User.user_new(req, res);
}

const errorMessages = {
    "dataMissing": [{ title: 'Data missing', detail: 'Provide email and username' }],
    "wrongIdentification": [{ title: 'Wrong identification', detail: `The username provided doesn't exist` }],
    "accountNotActive": [{ title: 'Account non active', detail: 'Your account hasn\'t been activated yet. Please check your email.' }],
    "wrongPassword": [{ title: 'Wrong identification', detail: 'Wrong password' }],
    "notAuthorized": [{ title: 'Not authorized', detail: 'You need to log in' }],
    "linkInvalid": [{title: 'Invalid Link', detail: 'Oops it seems like this link is no longer valid...'}]
}

exports.activate = function (req, res) {
    const userKey = req.params.key;

    return User.user_select('key', userKey)
        .then((result) => {
            User.user_set_active(result[0].id)
            return res.json(result)
        })
        .catch(() => {return res.status(422).send({ errors: errorMessages.wrongIdentification })})
}

exports.auth = function (req, res) {
    const {  password } = req.body;
    const username = req.body.username.toLowerCase() ;

    if (!password || !username) {
        return res.status(200).send({ errors: errorMessages.dataMissing });
    }

    return User.user_select('username', username)
        .then((result) => {
            if (result[0].active == '0') 
                return res.status(200).send({ errors: errorMessages.accountNotActive });
            return result
        })
        .then((result) => {
            return User.user_password_check(result, password)
                .then((result) => {
                    const userId = result[0].id;
                    axios.get(`http://api.ipstack.com/check?access_key=7b4aac12f356ba32dee5cb0d1dbfa762&format=1`).then((result) => {
                        result.json;
                        User.user_set_ip(result.data, userId);
                    }).catch((e) => console.log(e))
                    User.user_set_online('1', result[0].username)
                    return res.json(jwt.sign({
                        userId: userId,
                        username: result[0].username,
                        mail: result[0].mail,
                    }, config.SECRET, { expiresIn: '3h' }));
            })
            .catch(() => {
                return res.status(200).send({ errors: errorMessages.wrongPassword });
            })
        })
        .catch(() => {
            return res.status(200).send({ errors: errorMessages.wrongIdentification });
        })
}

exports.authMiddleware = function (req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        const user = parseToken(token);

        return User.user_select('id', user.userId)
            .then(() => {
                res.locals.user = user;
                next();
            })
            .catch(() => {return notAuthorized(res)})
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

exports.fetchAllUsersData = function (req, res) {
    // Public Data to be defined
    return User.user_select_all_public_data()
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch(() => {return res.status(422).send({ errors: errorMessages.dataMissing })})
}
