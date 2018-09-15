const pg = require('pg'),
    bcrypt = require('bcrypt'),
    config = require('../config/dev');

const pool = new pg.Pool(config.db);

function user_select_all(callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT mail, id, login FROM users', function (err, result) {
            done();
            return callback(err, result);
        });
    });
}

function user_select_one(key, value, callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(`SELECT mail, id, username FROM users WHERE ${key}=$1 `, [value], function (err, result) {
            done();
            return callback(err, result.rows);
        });
    });
}

function user_new(req, res) {

    const { name, last_name, username, mail, password} = req.body;

    user_select_one('username', username, function (err, result) {
        if (result.length != 0)
            return res.status(422).send({ errors: [{ title: 'User exists', detail: 'Username already exists' }] })
        else {
            user_select_one('mail', mail, function (err, result) {
                if (result.length != 0) {
                    return res.status(422).send({ errors: [{ title: 'User exists', detail: 'Email already used' }] })
                }
                else {
                    let hash = bcrypt.hashSync(password, 10);
                    pool.connect(function (err, client, done) {
                        if (err) {
                            return res.status(422).send({ errors: [{ title: 'Error fetching client from pool', detail: err }] })
                        }
                        client.query('INSERT INTO users (name, last_name, username, mail, password) VALUES($1, $2 ,$3, $4, $5)', [name, last_name, username, mail, hash]);
                        done();
                        return res.status(200).send({ success: [{title: 'Rental created', detail: 'You created a new rental'}] });
                    });
                }
            });
        }
    });
}

function user_password_check(id, password, cb) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT password FROM users WHERE id=$1', [id], function (err, result) {
            done()
            if (bcrypt.compareSync(password, result.rows[0].password))
                return cb(true);
            else
                return cb(false);
        })
    })
}

module.exports = {
    user_select_one,
    user_new,
    user_password_check
}